import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://swebster:k0dov8yRH*yUI0&3uf@cluster0.p2rcx.mongodb.net/storytyper?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });

export default client;
