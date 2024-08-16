const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Stores the game data based on the given user's name
recordRoutes.route("/storeGameData").post(async function (req, res) {
    try {
        const db = await dbo.getDb();
        const { name, loserCardCount, date, win } = req.body;
        
        const myquery = { name: req.body.name };
        const result = await db.collection("users").findOne(myquery);

        if (!result) {
            await db.collection("users").insertOne({
                name: name,
                games: [{ date: new Date(date), loserCardCount: loserCardCount, win: win }]
            });
        } else {
            await db.collection("users").findOneAndUpdate(myquery, { $addToSet:  { games: { date: new Date(date), loserCardCount: loserCardCount, win: win } } });
        }

        res.json({ message: "Game data stored successfully" });
    } catch (err) {
        console.error("Error storing game data:", err);
        res.status(500).json({ error: "Failed to store game data" });
    }
});

// Gets the given player's game history
recordRoutes.route("/getPlayer").post(async function(req, res) {
    try {
      const db_connect = await dbo.getDb();
      const myquery = { name: req.body.name };
      const result = await db_connect.collection("users").findOne(myquery);
  
      res.json(result);
    } catch (err) {
      throw err;
    }
});

module.exports = recordRoutes;