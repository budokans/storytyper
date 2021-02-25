import express from "express";
import cors from "cors";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
import db from "./lib/db";

const hostname = "127.0.0.1";
const port = 2094;

const app = express();
app.use(cors());

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!");

  const storiesData = await scrapeStories(
    "http://fiftywordstories.com/category/stories"
  );
  const { stories } = storiesData;
  res.json(stories);
});

app.get("/data", async (req, res, next) => {
  console.log("Getting stories from database...");

  const stories = db.get("stories");
  res.json(stories);
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
