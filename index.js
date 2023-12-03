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
    // await client.connect();

    const database = client.db("addPostsDB");
    const usersCollection = database.collection("users");
    const addPostsCollection = database.collection("addPosts");
    const commentsCollection = database.collection("comments");
    const announcementCollection = database.collection("announcement");

    app.get("/users", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      } else if (req.query?.name) {
        query = { name: req.query.name };
      }
      const cursor = usersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", inseredId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
      console.log(user);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUsers = req.body;
      const updatedUsers = {
        $set: {
          role: updateUsers.role,
        },
      };

      try {
        const result = await usersCollection.updateOne(
          filter,
          updatedUsers,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.put("/users/badgeInfo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUsers = req.body;
      const updatedUsers = {
        $set: {
          badge: updateUsers.badge,
        },
      };

      try {
        const result = await usersCollection.updateOne(
          filter,
          updatedUsers,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateComment = req.body;
      const updatedComment = {
        $set: {
          feedback: updateComment.feedback,
          reported: updateComment.reported,
        },
      };

      try {
        const result = await commentsCollection.updateOne(
          filter,
          updatedComment,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.put("/users/aboutMe/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateComment = req.body;
      console.log(updateComment);
      const updatedComment = {
        $set: {
          profession: updateComment.profession,
          education: updateComment.education,
          hobbies: updateComment.hobbies,
          description: updateComment.description,
        },
      };

      try {
        const result = await usersCollection.updateOne(
          filter,
          updatedComment,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await commentsCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/allPosts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addPostsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/allPosts", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { authorEmail: req.query.email };
      }
      const cursor = addPostsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/announcement", async (req, res) => {
      const cursor = announcementCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/announcement", async (req, res) => {
      const announcements = req.body;
      const result = await announcementCollection.insertOne(announcements);
      res.send(result);
      console.log(announcements);
    });

    app.get("/allPosts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addPostsCollection.findOne(query);
      res.send(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/addPosts", async (req, res) => {
      const addPosts = req.body;
      const result = await addPostsCollection.insertOne(addPosts);
      res.send(result);
      console.log(addPosts);
    });

    app.get("/comments", async (req, res) => {
      try {
        const comments = await commentsCollection.find().toArray();
        res.json(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/comments", async (req, res) => {
      const comments = req.body;
      const result = await commentsCollection.insertOne(comments);
      res.send(result);
      console.log(comments);
    });

    // New endpoint for sorting by PostUpVote and PostDownVote
    app.get("/popular", async (req, res) => {
      try {
        const posts = await addPostsCollection
          .aggregate([
            {
              $addFields: {
                upvoteMinusDownvote: {
                  $subtract: [
                    { $ifNull: ["$PostUpVote", 0] },
                    { $ifNull: ["$PostDownVote", 0] },
                  ],
                },
              },
            },
            {
              $sort: { upvoteMinusDownvote: -1 },
            },
          ])
          .toArray();

        res.send(posts);
      } catch (error) {
        console.error("Error fetching popular posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/allPosts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = req.body;
      console.log(updateData);

      let updateField;
      let updatedCount;

      if (updateData.postUpVote !== undefined) {
        // Increment upVote by one
        updatedCount = updateData.postUpVote;
        updateField = "postUpVote";
      } else if (updateData.postDownVote !== undefined) {
        // Increment downVote by one
        updatedCount = updateData.postDownVote;
        updateField = "postDownVote";
      } else {
        res.status(400).send("Invalid update data");
        return;
      }

      const updateObject = {
        $set: {
          [updateField]: updatedCount,
        },
      };

      try {
        const result = await addPostsCollection.updateOne(
          filter,
          updateObject,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/allPosts/vote/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = req.body;

      console.log(updateData.usersId);

      const userIdAlreadyVoted =
        updateData.usersId && updateData.usersId.includes(updateData.usersId);

      if (userIdAlreadyVoted) {
        return res.status(400).send("User has already voted.");
      }

      const updateObject = {
        $set: {
          postUpVote: updateData.postUpVote,
          postDownVote: updateData.postDownVote,
        },
        $push: {
          usersId: updateData.usersId, // Add the user's ID to the array
        },
      };

      try {
        const result = await addPostsCollection.updateOne(
          filter,
          updateObject,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
