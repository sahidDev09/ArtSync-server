const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// middleware

app.use(cors());
app.use(express.json());

// mongos code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ripcql3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const artsCollection = client.db("art&crafts").collection("arts&crafts");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // add data from client site

    app.post("/mycrafts", async (req, res) => {
      const query = req.body;
      const result = await artsCollection.insertOne(query);
      res.send(result);
    });

    //get all data from mongo

    app.get("/mycrafts", async (req, res) => {
      const cursor = artsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data by email from mongodb

    app.get("/mycrafts/:email", async (req, res) => {
      const result = await artsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // get data with specific id

    app.get("/updatecraft/:id", async (req, res) => {
      const result = await artsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(result);
    });

    // update data from client side

    app.put("/updatecraft/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          item_name: req.body.item_name,
          subcategory_name: req.body.subcategory_name,
          short_description: req.body.short_description,
          rating: req.body.rating,
          price: req.body.price,
          scustom: req.body.scustom,
          process_time: req.body.process_time,
          stock: req.body.stock,
        },
      };
      const result = await artsCollection.updateOne(query, data);
      res.send(result);
    });

    // get data for specific id's

    // app.get("/mycrafts/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await artsCollection.findOne(query);
    //   res.send(result);
    // });

    //delete data from client site

    app.delete("/mycrafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artsCollection.deleteOne(query);
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
  res.send("art sync server is running in the background");
});

app.listen(port, () => {
  console.log(`artSync in running in the port: ${port}`);
});
