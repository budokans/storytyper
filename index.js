import getStoriesData from "./lib/scraper";

async function go() {
  getStoriesData("http://fiftywordstories.com/category/stories/");
}

go();
