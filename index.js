const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); 
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors()); 
app.use(express.json()); 

// Mongo client (SAFE for Vercel)
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// reusable DB connection
async function getDB() {
  if (!db) {
    await client.connect();
    db = client.db("doc-appoint");
    console.log("MongoDB connected");
  }
  return db;
}

// ALL APPOINTMENTS
app.get("/all-appointment", async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection("all-appointment");

    const result = await collection.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// FEATURED
app.get("/featured", async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection("all-appointment");

    const result = await collection.find().limit(4).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured data" });
  }
});

// SINGLE APPOINTMENT
app.get("/all-appointment/:id", async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection("all-appointment");

    const id = req.params.id;

    const result = await collection.findOne({
      _id: new ObjectId(id),
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Invalid ID or server error" });
  }
});

// ROOT
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});