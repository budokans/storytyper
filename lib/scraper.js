import axios from "axios";
import cheerio from "cheerio";
import extractAuthorText from "./extractAuthorText";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function getStoriesData(html) {
  const $ = cheerio.load(html);

  $("article").each((idx, el) => {
    const titleText = $(el).find(".entry-title").text();
    const author = extractAuthorText(titleText);

    const url = $(el).find(".entry-title a").attr("href");

    console.log(author, url);
  });
}

export { getHTML, getStoriesData };
