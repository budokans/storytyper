import express from "express";
import getStoriesData from "./lib/scraper";
import db from "./lib/db";
const hostname = "127.0.0.1";
const port = 2093;

const app = express();

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!");
  const stories = await getStoriesData(
    "http://fiftywordstories.com/category/stories/"
  );

  console.log("Scraping complete!");
  res.json(stories);
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
