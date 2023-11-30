const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const schedule = require("node-schedule");
require("dotenv").config();
const router = express.Router();
const mongoURI = process.env.MONGO_URL;
const dbName = "chat";
const collectionName = "messages";

async function deleteMessages() {
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      await collection.deleteMany({});
    } finally {
      client.close();
    }
  }
  
  const job = schedule.scheduleJob('1 8 * * *', () => {
    deleteMessages();
  });

module.exports = router;