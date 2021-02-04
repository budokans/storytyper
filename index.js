import { getHTML, getStoriesData } from "./lib/scraper";

async function go() {
  getStoriesData(
    await getHTML("http://fiftywordstories.com/category/stories/")
  );
}

go();
