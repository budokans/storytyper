import cron from "node-cron";
import { runCron } from "./scraper";

cron.schedule("9 23 * * *", () => {
  console.log("Running the cron!");
  runCron();
});
