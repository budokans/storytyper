import cron from "node-cron";
import { runCron } from "./scraper";

cron.schedule("45 21 * * *", () => {
  console.log("Running the cron!");
  runCron();
});
