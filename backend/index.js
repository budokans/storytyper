import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import "dotenv/config";
import { connect, getDb } from "./lib/db";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";

const port = process.env.PORT;
const frontendURL = process.env.FRONTEND_URL;
const app = express();

app.use(
  cors({
    origin: frontendURL,
    optionsSuccessStatus: 200,
  })
);
app.use(compression());
app.use(helmet());

connect((err) => {
  if (err) {
    console.log("Unable to connect to database.");
    process.exit(1);
  } else {
    app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`App running at http://localhost:${port}/`);
    });
  }
});

app.get("/scrape", async (req, res) => {
  try {
    console.log("Scraping!");
    const storiesData = await scrapeStories(
      "http://fiftywordstories.com/category/stories/"
    );
    const { stories } = storiesData;
    res.json(stories);
  } catch (err) {
    console.log(err);
  }
});

app.get("/data", async (req, res) => {
  const date = new Date();
  const utc = date.toUTCString();

  console.log(`${utc}: Getting stories from database...`);

  const batchRequest = parseInt(req.query.batch);
  const batchRequestIsNumber = !isNaN(batchRequest);

  if (batchRequestIsNumber) {
    try {
      const db = getDb("storytyper");
      const skipMultiplier = 10;
      const skipVal = skipMultiplier * batchRequest;

      const cursor = await db.collection("stories").find().sort({ _id: -1 });
      const batch = await cursor.skip(skipVal).limit(skipMultiplier);
      const stories = await batch.toArray();

      res.json(stories);
    } catch (err) {
      console.log(err);
    }
  }
});

app.get("/count", async (req, res) => {
  const date = new Date();
  const utc = date.toUTCString();

  try {
    const db = getDb("storytyper");
    const storiesCollection = db.collection("stories");
    const storiesCount = await storiesCollection.countDocuments();

    res.json({ count: storiesCount });
    console.log(`${utc}: Documents count = ${storiesCount}`);
  } catch (err) {
    console.log(err);
  }
});
