const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
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
    const commentCollection = client.db("Valence").collection("comments");

    // USER

    // Post a user
    app.post("/users", async (req, res) => {
      const query = req.body;
      const result = await usersCollection.insertOne(query);
      res.send(result);
    });

    // Get user Profile
    app.get("/user", async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = { userEmail: userEmail };
      // console.log(query);
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Update a User get
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // Update a User Put
    app.put("/user", async (req, res) => {
      const userEmail = req.body.userEmail;
      const data = req.body;
      // console.log(data);
      const query = { userEmail: userEmail };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          userName: data.userName,
          userEmail: data.userEmail,
          userPhoto: data.userPhoto,
          university: data.university,
          address: data.address,
          Phone: data.Phone,
          Birthday: data.Birthday,
          Gender: data.Gender,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // POST

    // Post a Post
    app.post("/posts", async (req, res) => {
      const query = req.body;
      const result = await PostCollection.insertOne(query);
      res.send(result);
    });

    // Get all Post
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await PostCollection.find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // Get post comment update
    app.post("/comments", async (req, res) => {
      const query = req.body;
      const result = await commentCollection.insertOne(query);
      res.send(result);
    });

    // Get one post
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await PostCollection.findOne(query);
      res.send(result);
    });

    // get all Comments for one post
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { postId: id };
      const result = await commentCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // POST route for liking a post
    app.post("/like/:id", (req, res) => {
      // Retrieve the ID of the post to like from the request parameters
      const id = req.params.id;

      // Find the post in the database
      PostCollection.findOne({ _id: ObjectId(id) }, (error, post) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else if (!post) {
          // If the post doesn't exist, return a 404 error
          res.sendStatus(404);
        } else {
          // Update the likeCount field of the post by incrementing it by 1
          PostCollection.updateOne(
            { _id: ObjectId(id) },
            { $inc: { likeCount: 1 } },
            (error) => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                // Send a response to the client to indicate that the like was successful
                res.sendStatus(200);
              }
            }
          );
        }
      });
    });

    // POST route for disliking a post
    app.post("/dislike/:id", (req, res) => {
      // Retrieve the ID of the post to dislike from the request parameters
      const id = req.params.id;

      // Find the post in the database
      PostCollection.findOne({ _id: ObjectId(id) }, (error, post) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else if (!post) {
          // If the post doesn't exist, return a 404 error
          res.sendStatus(404);
        } else {
          // Update the likeCount field of the post by decrementing it by 1
          PostCollection.updateOne(
            { _id: ObjectId(id) },
            { $inc: { likeCount: -1 } },
            (error) => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                // Send a response to the client to indicate that the dislike was successful
                res.sendStatus(200);
              }
            }
          );
        }
      });
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
