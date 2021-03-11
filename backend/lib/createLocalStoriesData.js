import * as fs from "fs";
import { getDb } from "./db";

// Use this to grab 200 stories and store them in a json file for backup data to be rendered if the API call fails.
export async function createLocalStoriesData(count, offset) {
  const db = getDb("storytyper");
  const storiesCollection = db.collection("stories");
  const cursor = await storiesCollection
    .find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(count);
  const data = await cursor.toArray();
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
