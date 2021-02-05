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

    const id = $(el).attr("id").replace(/post-/, "");
    const author = extractAuthorText(headerText);
    const title = extractTitleText(headerText);
    const url = $(el).find(".entry-title a").attr("href");
    const bio = $(el).find("hr").next().html();

    // Story with HTML intact and story as text
    let storyHTML = "";
    let storyText = "";
    $(el)
      .find(".entry-content")
      .each((i, el) => {
        const postContent = $(el).html().trim().replace(/\n/g, "");
        const storyOnly = postContent.slice(0, postContent.indexOf("<hr>"));
        storyHTML = storyOnly;
        storyText = storyOnly
          .replace(/(<[a-z]+>)/g, "")
          .replace(/(<\/[a-z]+>)/g, " ")
          .trim();
      });

    console.log(storyHTML, storyText);
  });
}

export { getHTML, getStoriesData };
