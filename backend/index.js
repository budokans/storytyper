import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { scrapeStories } from "./lib/scraper";
import "./lib/cron";
import db from "./lib/db";

// mongoDB stuff
const uri =
  "mongodb+srv://swebster:k0dov8yRH*yUI0&3uf@cluster0.p2rcx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

// Express and route handlers stuff

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
  res.json(stories);
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
