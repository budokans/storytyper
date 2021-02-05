import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function getStoriesData(html) {
  const $ = cheerio.load(html);

  $("article").each((i, el) => {
    const headerText = $(el).find(".entry-title").text();

    const author = extractAuthorText(headerText);
    const title = extractTitleText(headerText);
    const url = $(el).find(".entry-title a").attr("href");
    const bio = $(el).find("hr").next().html();

    // Story with HTML intact
    let story = "";
    $(el)
      .find(".entry-content")
      .each((i, el) => {
        const postContent = $(el).html().trim().replace(/\n/g, "");
        const storyHTML = postContent.slice(0, postContent.indexOf("<hr>"));
        story += storyHTML;
      });

    console.log(author, title, url, story, bio);
  });
}

export { getHTML, getStoriesData };
