import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://swebster:k0dov8yRH*yUI0&3uf@cluster0.p2rcx.mongodb.net/storytyper?retryWrites=true&w=majority";

let client = null;

// Create a connection to uri and call callback()
function connect(callback) {
  if (client === null) {
    // Create a mongoDB client
    client = new MongoClient(uri, { useUnifiedTopology: true });
    // Establish a new connection
    client.connect((err) => {
      if (err) {
        client = null;
        callback(err);
      } else {
        callback();
      }
    });
  } else {
    // Connection already established
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
