import { MongoClient } from "mongodb";
import config from "../conf/mongoConfig";

const uri = `mongodb+srv://${config.user}:${config.pass}@${config.cluster}.mongodb.net/storytyper?retryWrites=true&w=majority`;

let client = null;

function connect(callback) {
  if (client === null) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
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
