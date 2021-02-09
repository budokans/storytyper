import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";

let pageCount = 0;
let storyCount = 0;
let errorCount = 0;
let pageLimit = 2;
let storiesArray = [];

// Get the HTML of the page to be scraped
async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

// Paginate and scrape story data from older pages
function scrapeNextPage(NextPageURL) {
  const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;

  setTimeout(() => {
    getStoriesData(NextPageURL);
  }, randNumBetween3And7);

  console.log(`Scraping Next Page... in ${randNumBetween3And7} milliseconds`);
}

// Capture the data from each story post
export default async function getStoriesData(url) {
  const html = await getHTML(url);
  const $ = cheerio.load(html);

  $("article").each((i, el) => {
    const headerText = $(el).find(".entry-title").text();

    // Check for author: title format in header. If only the title is present, the data for that post will be incomplete, so the entire post is ignored.
    if (!headerText.includes(":")) {
      errorCount++;
      return;
    } else {
      storyCount++;
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
    }
  });

  // Get the link to the next oldest page if it exists
  const paginationLink = $(".nav-previous a").attr("href");

  // Check that the current page isn't the last page before trying to scrape another page
  pageCount++;
  if (pageCount < pageLimit && paginationLink) {
    scrapeNextPage(paginationLink);
  } else {
    return storiesArray;
  }
}
