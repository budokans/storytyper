import express from "express";
import { scrapeStories } from "./lib/scraper";
import db from "./lib/db";
const hostname = "127.0.0.1";
const port = 2094;

const app = express();

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!");

  scrapeStories("http://fiftywordstories.com/category/stories/")
    .then((result) => result)
    .then((storiesData) => {
      const { stories, scrapeCount, pageCount } = storiesData;
      console.log(
        `Scraping complete: ${scrapeCount} stories successfully scraped over ${pageCount} pages`
      );
      stories.reverse().forEach((story) => {
        story.dateScraped = Date.now();

        // Check if the story has an author. If not, push to storiesToEdit array
        story.author
          ? db.get("stories").unshift(story).write()
          : db.get("storiesToEdit").unshift(story).write();
      });

      res.json(stories);
    });
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
