import cron from "node-cron";
import { runCron } from "./scraper";

cron.schedule("5 */2 * * *", () => {
  // cron.schedule("54 * * * *", () => {
  console.log("Running the cron!");
  runCron();
});
