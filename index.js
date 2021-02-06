import getStoriesData from "./lib/scraper";

async function go() {
  await getStoriesData("http://fiftywordstories.com/category/stories/");
}

go();
