import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";
import { getDb } from "./db";

let pageCount = 0;
// let pageLimit = 25;

// Get the HTML of the page to be scraped
async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

// Capture the story data from the page
async function scrapePage(url, newestStoryId) {
  const html = await getHTML(url);
  const $ = cheerio.load(html);

  let storiesArray = [];
  let scrapeCount = 0;
  let upToDate = false;
  pageCount++;

  const date = new Date();
  const utc = date.toUTCString();

  console.log(`Scraping ${url}...`);

  $("article").each((i, el) => {
    const id = $(el).attr("id").replace(/post-/, "").trim();

    // When the scraper has reached the most recent story in the db, stop scraping
    if (newestStoryId === id) {
      upToDate = true;
      console.log("Scraping finished, nothing to see here!");
      return;
    } else if (!upToDate) {
      const headerText = $(el).find(".entry-title").text();
      const author = extractAuthorText(headerText).trim();
      const title = extractTitleText(headerText).trim();
      const url = $(el).find(".entry-title a").attr("href");
      const bio = $(el).find("hr").next().html()
        ? $(el).find("hr").next().html().trim()
        : "Bio not found...";
      const dateScraped = utc;

      // Get story with HTML intact for 'show formatting' view on front end.
      let storyHTML = "";
      $(el)
        .find(".entry-content")
        .each((i, el) => {
          const postContent = $(el).html().trim().replace(/\n/g, "");
          const hrExists = postContent.includes("<hr>");
          const endOfStory = hrExists ? "<hr>" : "<div";
          storyHTML = postContent.slice(0, postContent.indexOf(endOfStory));
        });

      // Format story text for use in game as reference text for the typing race.
      const storyText = formatStoryText(storyHTML);

      // Create story object and push to array
      const story = {
        id,
        author,
        title,
        url,
        storyHTML,
        storyText,
        bio,
        dateScraped,
      };
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
async function waitToScrape(url, newestStoryId) {
  const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;
  console.log(`Scraping next page in ${randNumBetween3And7} milliseconds...`);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(randNumBetween3And7);
  return await scrapeStories(url, newestStoryId);
}

// Scrape (potentially) the entire site for new stories
export async function scrapeStories(url, newestStoryId) {
  const storiesFragment = await scrapePage(url, newestStoryId);

  // If it's not the last page and the scraper has yet to encounter the newest scrape present in the database, then scrape next page and concatenate scrapes with those all scraped. N.B.: pageLimit check only for dev purposes.
  if (
    storiesFragment.nextPage &&
    !storiesFragment.upToDate
    // && pageCount < pageLimit
  ) {
    const {
      stories: nextPageStories,
      scrapeCount: nextPageScrapeCount,
      pageCount,
    } = await waitToScrape(storiesFragment.nextPage, newestStoryId);

    return {
      stories: storiesFragment.stories.concat(nextPageStories),
      scrapeCount: storiesFragment.scrapeCount + nextPageScrapeCount,
      pageCount,
    };
  } else {
    return storiesFragment;
  }
}

// Insert stories to Db
async function insertToDb(db, stories) {
  const storiesCollection = db.collection("stories");
  const storiesToEditCollection = db.collection("storiesToEdit");

  // Reverse the stories array so that the newest story scraped from the site will be insert with the _id of the highest value, needed for getNewestStoryId
  stories = stories.reverse();

  const readyStories = stories.filter((story) => story.author.length >= 1);
  const unreadyStories = stories.filter((story) => story.author.length === 0);

  const completeStoriesResult =
    readyStories.length > 1
      ? await storiesCollection.insertMany(readyStories, {
          ordered: true,
        })
      : readyStories.length === 1
      ? await storiesCollection.insertOne(readyStories[0])
      : undefined;

  const storiesToEditResult =
    unreadyStories.length > 1
      ? await storiesToEditCollection.insertMany(unreadyStories, {
          ordered: true,
        })
      : unreadyStories.length === 1
      ? await storiesToEditCollection.insertOne(unreadyStories[0])
      : undefined;

  const count =
    (completeStoriesResult ? completeStoriesResult.insertedCount : 0) +
    (storiesToEditResult ? storiesToEditResult.insertedCount : 0);

  console.log(`${count} out of ${stories.length} documents were inserted`);
}

async function getNewestStoryId(db) {
  const storiesCollection = db.collection("stories");
  const storiesToEditCollection = db.collection("storiesToEdit");

  // Sorts collection by _id and gets the id of the most recently added doc
  async function getLatestIdInCollection(collection) {
    const resultArr = await collection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    const latestId = resultArr[0].id;
    return latestId;
  }

  const mostRecentStoryId = await getLatestIdInCollection(storiesCollection);
  const mostRecentStoryToEditId = await getLatestIdInCollection(
    storiesToEditCollection
  );

  // Return whichever is higher, i.e. most likely more recent
  return mostRecentStoryId > mostRecentStoryToEditId
    ? mostRecentStoryId
    : mostRecentStoryToEditId;
}

// Run scrapeStories on a schedule and add scrapes to db
export async function runCron() {
  const db = getDb("storytyper");

  // Remove collections for a restart/testing
  // await db.dropCollection("stories");
  // await db.dropCollection("storiesToEdit");

  // Get most recent story in db's ID
  const newestStoryId = await getNewestStoryId(db).catch(console.dir);

  console.log("Scraping!");

  const storiesData = await scrapeStories(
    "http://fiftywordstories.com/category/stories/",
    newestStoryId
  );
  const { stories, scrapeCount } = storiesData;

  const date = new Date();
  const utc = date.toUTCString();

  console.log(
    `Scraping completed at ${utc}: ${scrapeCount} stories successfully scraped over ${pageCount} pages`
  );

  // Add any scraped stories to the database
  if (stories.length > 0) {
    insertToDb(db, stories).catch(console.dir);
  }

  pageCount = 0;
}
