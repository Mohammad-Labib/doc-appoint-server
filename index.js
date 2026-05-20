const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI;

const app = express()
const PORT = process.env.PORT

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        const db = client.db("doc-appoint");
        const usersCollection = db.collection("all-appointment");

        app.get("/all-appointment", async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get("/featured", async(req, res) => {
            const cursor = usersCollection.find().limit(4);
            const result = await cursor.toArray();
            res.send(result)
        })

        // single grate
        app.get("/all-appointment/:id", async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id)};
            const result = await usersCollection.findOne(query);
            res.send(result);

        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running ")
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})