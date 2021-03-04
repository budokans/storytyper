import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://swebster:k0dov8yRH*yUI0&3uf@cluster0.p2rcx.mongodb.net/storytyper?retryWrites=true&w=majority";

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
