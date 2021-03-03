import axios from "axios";
import cheerio from "cheerio";
import db from "./db";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";
import client from "./dbMongo";

let pageCount = 0;
let pageLimit = 2;

// Get the HTML of the page to be scraped
async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

// Capture the data from each story post in an object and push to an array
async function getStoriesData(url) {
  const html = await getHTML(url);
  const $ = cheerio.load(html);
  let storiesArray = [];
  let scrapeCount = 0;
  let upToDate = false;
  const latestDbStoryId = db.get("stories[0].id").value();
  pageCount++;

  console.log(`Scraping ${url}...`);

  $("article").each((i, el) => {
    const id = $(el).attr("id").replace(/post-/, "").trim();

    // When the scraper has reached the most recent story in the db, stop scraping
    if (latestDbStoryId === id) {
      upToDate = true;
      return;
    } else if (!upToDate) {
      const headerText = $(el).find(".entry-title").text();
      const author = extractAuthorText(headerText).trim();
      const title = extractTitleText(headerText).trim();
      const url = $(el).find(".entry-title a").attr("href");
      const bio = $(el).find("hr").next().html().trim();

      // Get story with HTML intact for 'show formatting' view on front end.
      let storyHTML = "";
      $(el)
        .find(".entry-content")
        .each((i, el) => {
          const postContent = $(el).html().trim().replace(/\n/g, "");
          storyHTML = postContent.slice(0, postContent.indexOf("<hr>"));
        });

      // Format story text for use in game as reference text for the typing race.
      const storyText = formatStoryText(storyHTML);

      // Create story object and push to array
      const story = { id, author, title, url, storyHTML, storyText, bio };
      storiesArray.push(story);
      scrapeCount++;
    }
  });

  // Get the link to the next oldest page if it exists
  const paginationLink = $(".nav-previous a").attr("href");
  return {
    stories: storiesArray,
    scrapeCount: scrapeCount,
    nextPage: paginationLink,
    upToDate,
  };
}

// Scrape the next page after a randomized interval
async function waitToScrape(url) {
  const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;

  console.log(`Scraping next page in ${randNumBetween3And7} milliseconds...`);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(randNumBetween3And7);
  return await getStoriesData(url);
}

// Scrape url for new stories
export async function scrapeStories(url) {
  const storiesFragment = await getStoriesData(url);

  // If it's not the last page and the scraper has yet to encounter the newest scrape present in the database, then scrape next page and concatenate scrapes with those all scraped. N.B.: pageLimit check only for dev purposes.
  if (
    storiesFragment.nextPage &&
    !storiesFragment.upToDate &&
    pageCount < pageLimit
  ) {
    const {
      stories: nextPageStories,
      scrapeCount: nextPageScrapeCount,
      pageCount,
    } = await waitToScrape(storiesFragment.nextPage);

    return {
      stories: storiesFragment.stories.concat(nextPageStories),
      scrapeCount: storiesFragment.scrapeCount + nextPageScrapeCount,
      pageCount,
    };
  } else {
    return storiesFragment;
  }
}

// Run scrapeStories on a schedule
export async function runCron() {
  console.log("Scraping!");

  const storiesData = await scrapeStories(
    "http://fiftywordstories.com/category/stories"
  );
  const { stories, scrapeCount } = storiesData;
  const date = new Date();
  const utc = date.toUTCString();

  console.log(
    `Scraping completed at ${utc}: ${scrapeCount} stories successfully scraped over ${pageCount} pages`
  );

  // Connect to mongoDb db
  if (stories.length > 0) {
    try {
      await client.connect();
      const database = client.db("storytyper");
      const storiesCollection = database.collection("stories");
      const storiesToEditCollection = database.collection("storiesToEdit");

      // stories.reverse().forEach((story) => {
      //   story.dateScraped = utc;
      //   console.log("looping!");

      //   story.author
      //     ? storiesCollection.insertOne(story)
      //     : storiesToEditCollection.insertOne(story);
      // });
      const result = await storiesCollection.insertMany(stories, {
        ordered: true,
      });
      console.log(`${result.insertedCount} documents were inserted`);
    } finally {
      console.log("closing");
      client.close();
    }
  }

  // // Add stories to database such that the most recent story published is positioned at index 0
  // stories.reverse().forEach((story) => {
  //   story.dateScraped = utc;

  //   // Check if the story has an author. If not, push to storiesToEdit array
  //   story.author
  //     ? db.get("stories").unshift(story).write()
  //     : db.get("storiesToEdit").unshift(story).write();
  });

  // Reset page count
  pageCount = 0;
}
