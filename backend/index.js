import express from "express";
import cors from "cors";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
import { connect, getDb } from "./lib/db";

const hostname = "127.0.0.1";
const port = 2094;

const app = express();
app.use(cors());

connect((err) => {
  if (err) {
    console.log("Unable to connect to database.");
    process.exit(1);
  } else {
    app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`App running at http://${hostname}:${port}/`);
    });
  }
});

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

  const db = getDb("storytyper");
  const cursor = await db.collection("stories").find();
  const stories = await cursor.toArray();

  res.json(stories);
});
