import express from "express";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
const hostname = "127.0.0.1";
const port = 2094;

const app = express();

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!");

  scrapeStories("http://fiftywordstories.com/category/stories").then(
    (storiesData) => {
      const { stories } = storiesData;
      res.json(stories);
    }
  );
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
