import express from "express";
import cors from "cors";
import { runCron, scrapeStories } from "./lib/scraper";
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
    "http://fiftywordstories.com/category/stories/"
  );
  const { stories } = storiesData;
  res.json(stories);
});

app.get("/data", async (req, res) => {
  console.log("Getting stories from database...");

  const skipMultiplier = 10;
  const batchRequest = req.query.batch;
  const skipVal = skipMultiplier * batchRequest;

  const db = getDb("storytyper");
  const storiesCollection = db.collection("stories");
  const storiesCount = storiesCollection.countDocuments();
  const cursor = await db.collection("stories").find().sort({ _id: -1 });
  const batch = await cursor.skip(skipVal).limit(skipMultiplier);
  const stories = await batch.toArray();

  res.json(stories);
});
