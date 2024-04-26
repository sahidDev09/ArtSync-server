const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

// middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("art sync server is running in the background");
});

app.listen(port, () => {
  console.log(`artSync in running in the port: ${port}`);
});
