import { MongoClient } from "mongodb";
import { config } from "dotenv";

let client = null;

function connect(callback) {
  if (client === null) {
    client = new MongoClient(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) {
        client = null;
        callback(err);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function getDb(dbName) {
  return client.db(dbName);
}

function close() {
  if (client) {
    client.close();
    client = null;
  }
}

export { connect, getDb, close };
