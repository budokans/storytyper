import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";

let pageCount = 0;
let storyCount = 0;
let errorCount = 0;
let pageLimit = 2;

// Get the HTML of the page to be scraped
async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

// Paginate and scrape story data from older pages
function paginate(cheerio) {
  pageCount++;
  const paginationLink = cheerio(".nav-previous a").attr("href");

  // Checks that the current page isn't the last page before proceeding
  if (pageCount < pageLimit && paginationLink) {
    const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;

    setTimeout(() => {
      getStoriesData(paginationLink);
    }, randNumBetween3And7);

    console.log(`Scraping Next Page... in ${randNumBetween3And7} milliseconds`);
  } else {
    return;
  }
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
      const id = $(el).attr("id").replace(/post-/, "");
      const author = extractAuthorText(headerText);
      const title = extractTitleText(headerText);
      const url = $(el).find(".entry-title a").attr("href");
      const bio = $(el).find("hr").next().html();

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
      console.log(id);
    }
  });

  // Pass the cheerio to the paginate function and get scraping the next oldest page.
  paginate($);
}
