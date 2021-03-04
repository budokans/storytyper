import express from "express";
import cors from "cors";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
import db from "./lib/lowDb";
// import mongoUtil from "./lib/mongoUtil";

const hostname = "127.0.0.1";
const port = 2094;

const app = express();
app.use(cors());

app.get("/scrape", async (req, res) => {
  console.log("Scraping!");

  const storiesData = await scrapeStories(
    "http://fiftywordstories.com/category/stories"
  );
  const { stories } = storiesData;
  res.json(stories);
});

app.get("/data", async (req, res) => {
  console.log("Getting stories from database...");
  const stories = db.get("stories");
  // console.log(stories);
  // const db = mongoUtil.getDb();
  // const cursor = await db.collection("stories").find({});
  // const stories = cursor.toArray();
  res.json(stories);
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
