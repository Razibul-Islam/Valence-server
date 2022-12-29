const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.5jjbyfi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("Valence").collection("users");
    const PostCollection = client.db("Valence").collection("Posts");
    
    // Post a user
    app.post("/users", async (req, res) => {
      const query = req.body;
      const result = await usersCollection.insertOne(query);
      res.send(result);
    });

    // Post a Post
    app.post("/posts", async (req, res) => {
      const query = req.body;
      const result = await PostCollection.insertOne(query);
      res.send(result);
    });

    // Get all Post
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await PostCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Valence is running");
});

app.listen(port, () => {
  console.log(`Valence listening on port ${port}`);
});
