import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ stories: [], count: 0 }).write();

export default db;
