const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

// middleware

app.use(cors());
app.use(express.json());

// mongos code

const uri =
  "mongodb+srv://artSyncme:admins1234@cluster0.ripcql3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    app.post("/addcrafts", async (req, res) => {
      const query = req.body;
      const result = await artsCollection.insertOne(query);
      res.send(result);
    });

    // get data from mongodb

    

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
