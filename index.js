require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://alircraj:jVUqcOWEmGU0BimI@cluster0.9hya0nn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("addPostsDB");
    const userCollection = database.collection("addPosts");
    const commentsCollection = database.collection("comments");

    app.get("/allPosts", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allPosts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/addPosts", async (req, res) => {
      const addPosts = req.body;
      const result = await userCollection.insertOne(addPosts);
      res.send(result);
      console.log(addPosts);
    });
    app.post("/comments", async (req, res) => {
      const comments = req.body;
      const result = await commentsCollection.insertOne(comments);
      res.send(result);
      console.log(comments);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
