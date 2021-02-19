import axios from "axios";
import cheerio from "cheerio";
// import db from "./db";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";

let pageCount = 0;
let pageLimit = 3;

// Get the HTML of the page to be scraped
async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

// Capture the data from each story post
async function getStoriesData(url) {
  const html = await getHTML(url);
  const $ = cheerio.load(html);
  let storiesArray = [];
  let scrapeCount = 0;

  console.log(`Scraping ${url}...`);

  $("article").each((i, el) => {
    const headerText = $(el).find(".entry-title").text();

    const id = $(el).attr("id").replace(/post-/, "").trim();
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
  });

  // Get the link to the next oldest page if it exists
  const paginationLink = $(".nav-previous a").attr("href");

  pageCount++;

  return {
    stories: storiesArray,
    scrapeCount: scrapeCount,
    pageCount: pageCount,
    nextPage: paginationLink,
  };
}

export async function scrapeStories(url) {
  const storiesFragment = await getStoriesData(url);

  if (storiesFragment.nextPage && pageCount < pageLimit) {
    const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;

    const wait = (ms) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(scrapeStories(storiesFragment.nextPage));
        }, ms);
        console.log(`Scraping next page in ${ms} milliseconds...`);
      });

    const {
      stories: nextPageStories,
      scrapeCount: nextPageScrapeCount,
      pageCount,
    } = await wait(randNumBetween3And7);

    return {
      stories: storiesFragment.stories.concat(nextPageStories),
      scrapeCount: storiesFragment.scrapeCount + nextPageScrapeCount,
      pageCount,
    };
  } else {
    return storiesFragment;
  }
}
