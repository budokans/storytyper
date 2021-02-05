import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";
import formatStoryText from "./formatStoryText";

let pageCount = 0;
let storyCount = 0;
let errorCount = 0;
let pageLimit = 2;

export default async function getStoriesData(url) {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  $("article").each((i, el) => {
    const headerText = $(el).find(".entry-title").text();

    // Checks for author: title format in header. If only the title is present, the data for that post will be incomplete, so the entire post is ignored.
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

      // Story with HTML intact and story as text
      let storyHTML = "";
      $(el)
        .find(".entry-content")
        .each((i, el) => {
          const postContent = $(el).html().trim().replace(/\n/g, "");
          storyHTML = postContent.slice(0, postContent.indexOf("<hr>"));
        });

      // Format story text for use in game
      const storyText = formatStoryText(storyHTML);
      console.log(id);
    }
  });

  // Paginate and scrape older pages
  pageCount++;
  const paginationLink = $(".nav-previous a").attr("href");

  // Checks that the current page isn't the last page before proceeding
  if (paginationLink) {
    const randNumBetween3And7 = (Math.random() * 4 + 3) * 1000;

    setTimeout(() => {
      getStoriesData(paginationLink);
    }, randNumBetween3And7);

    console.log(`Scraping Next Page... in ${randNumBetween3And7} milliseconds`);
  } else {
    return;
  }
}
