const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Get all scores (Except those with 0 score)
recordRoutes.route("/scores").get(async function (req, res) {
    try {
      const db_connect = await dbo.getDb("numguessing");
      const result = await db_connect.collection("scores").find({ score: { $gt: 0 } }).sort({score: 1}).toArray();
      
      res.json(result);
    } catch (err) {
      throw err;
    }
});

// Get a single score with provided id
recordRoutes.route("/scores/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("scores").findOne(myquery);
    
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// Create a new score entry and generate them a random num and set score to 0
recordRoutes.route("/scores/add").post(async function (req, res) {
    try {
      const db_connect = await dbo.getDb();
      const myobj = {
        name: req.body.name,
        score: 0,
        number: (Math.floor(Math.random() * 100) + 1),
      };
      const result = await db_connect.collection("scores").insertOne(myobj);
      res.json(result);
    } catch (err) {
      throw err;
    }
});

// Increments the score by one for the specified id and checks the guess
recordRoutes.route("/guess/:num/:id").get(async function (req, res) {
    try {
      const db_connect = await dbo.getDb();
      const myquery = { _id: new ObjectId(req.params.id) };
      const guess = parseInt(req.params.num);
      
      const newvalues = {
        $inc: {
          score: 1, // Increment by 1
        },
      };

      const result = await db_connect.collection("scores").updateOne(myquery, newvalues);
      console.log("1 document updated");

      const item = await db_connect.collection("scores").findOne(myquery);
      const number = parseInt(item.number);

      if(guess > number) {
        res.status(200).json({ message: 'Lower than ' + guess });
      } 
      else if (guess < number) {
        res.status(200).json({ message: 'Higher than ' + guess });
      } 
      else {
        res.status(200).json({ message: 'You Win!' });
      }

      } catch (err) {
        throw err;
      }
});

module.exports = recordRoutes;