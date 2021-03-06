import express from "express";
import cors from "cors";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
import { connect, getDb } from "./lib/db";

const hostname = process.env.hostname;
const port = process.env.port;

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
  const date = new Date();
  const utc = date.toUTCString();

  console.log(`${utc}: Getting stories from database...`);

  const db = getDb("storytyper");

  const skipMultiplier = 10;
  const batchRequest = req.query.batch;
  const skipVal = skipMultiplier * batchRequest;

  const cursor = await db.collection("stories").find().sort({ _id: -1 });
  const batch = await cursor.skip(skipVal).limit(skipMultiplier);
  const stories = await batch.toArray();

  res.json(stories);
});

app.get("/count", async (req, res) => {
  const date = new Date();
  const utc = date.toUTCString();

  const db = getDb("storytyper");
  const storiesCollection = db.collection("stories");
  const storiesCount = await storiesCollection.countDocuments();

  console.log(`${utc}: Getting documents count... count = ${storiesCount}`);

  res.json({ count: storiesCount });
});
