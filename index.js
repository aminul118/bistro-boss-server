require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

/**
 * ----------------------------------------
 * !             Midleware
 * ----------------------------------------
 */

app.use(cors());
app.use(express.json());

/**
 * ----------------------------------------
 * !             Database connections
 * ----------------------------------------
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4uwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    /**
     * ----------------------------------------
     * !            Create database connections
     * ----------------------------------------
     */
    const db = client.db("BistroDB");
    const menuCollections = db.collection("menu");
    const reviewsCollections = db.collection("reviews");
    const cartCollections = db.collection("carts");

    /**
     * ----------------------------------------
     * !            Menu
     * ----------------------------------------
     */

    app.get("/menu", async (req, res) => {
      const result = await menuCollections.find().toArray();
      res.send(result);
    });

    /**
     * ----------------------------------------
     * !            Reviews
     * ----------------------------------------
     */
    app.get("/review", async (req, res) => {
      const result = await reviewsCollections.find().toArray();
      res.send(result);
    });

    /**
     * ----------------------------------------
     * !            Carts
     * ----------------------------------------
     */
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollections.insertOne(cartItem);
      res.send(result);
    });
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollections.find(query).toArray();
      res.send(result);
    });
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollections.deleteOne(query);
      res.send(result);
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
  res.send("Server is running on root....");
});

app.listen(port, () => {
  console.log("APP is running on port", port);
});
