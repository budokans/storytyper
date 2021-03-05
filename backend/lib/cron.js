import cron from "node-cron";
import { runCron } from "./scraper";

cron.schedule("28 2 * * *", () => {
  console.log("Running the cron!");
  runCron();
});
