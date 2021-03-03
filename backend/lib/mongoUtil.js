import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://swebster:k0dov8yRH*yUI0&3uf@cluster0.p2rcx.mongodb.net/storytyper?retryWrites=true&w=majority";

let _db;

const mongoUtil = {
  connectToServer: (callback) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
      _db = client.db("storytyper");
      return callback(err);
    });
  },
  getDb: () => {
    return _db;
  },
};

export default mongoUtil;
