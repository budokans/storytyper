import axios from "axios";
import cheerio from "cheerio";
import { extractAuthorText, extractTitleText } from "./massageHeaderText";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function getStoriesData(html) {
  const $ = cheerio.load(html);

  $("article").each((idx, el) => {
    const headerText = $(el).find(".entry-title").text();

    const author = extractAuthorText(headerText);
    const title = extractTitleText(headerText);

    const url = $(el).find(".entry-title a").attr("href");

    console.log(author, title, url);
  });
}

export { getHTML, getStoriesData };
