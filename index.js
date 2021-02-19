import express from "express";
import { scrapeStories } from "./lib/scraper";
import db from "./lib/db";
const hostname = "127.0.0.1";
const port = 2094;

const app = express();

// // const lastStoryId = db.get(`stories[0].id`).value();
// async function go() {
//   const storiesPromise = getStoriesData(
//     "http://fiftywordstories.com/category/stories/"
//   );
//   const [stories, scrapeCount] = await storiesPromise;
//   console.log(storiesPromise);
//   console.log(stories, scrapeCount);
// }

// go();

app.get("/scrape", async (req, res, next) => {
  console.log("Scraping!");

  scrapeStories("http://fiftywordstories.com/category/stories/")
    .then((result) => result)
    .then((storiesData) => {
      const { stories, scrapeCount, pageCount } = storiesData;
      console.log(
        `Scraping complete: ${scrapeCount} stories successfully scraped over ${pageCount} pages`
      );
      stories.forEach((story) => {
        story.dateScraped = Date.now();

        // Check if the story has an author. If not, push to storiesToEdit array
        story.author
          ? db.get("stories").push(story).write()
          : db.get("storiesToEdit").push(story).write();
      });

      res.json(stories);
    });
});

app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});
