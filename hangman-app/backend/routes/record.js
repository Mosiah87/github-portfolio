const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the high scores.
recordRoutes.route("/highscores/:wordlength").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const wordLength = parseInt(req.params.wordlength); // Convert wordlength parameter to integer
    const result = await db_connect.collection("scores").find({ wordLength: wordLength, incorrectGuessCt: { $gte: 0, $lt: 6 }, gameWin: true}).toArray(); 
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" }); // Handle errors gracefully
  }
});

// Gets a random word, sets it as the selected word in the scores table, and sends back it's length
recordRoutes.route("/newWord").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const wordResult = await db_connect.collection("words").aggregate([{ $sample: { size: 1 } }]).next();
    
    const selectedWord = wordResult.word;
    const wordLength = selectedWord.length;

    const myobj = {
      gameWin: false,
      name: req.body.name,
      totalGuessCt: 0,
      incorrectGuessCt: 0, 
      word: selectedWord,
      wordLength: wordLength
    };
    const result = await db_connect.collection("scores").insertOne(myobj);

    res.json({ insertedId: result.insertedId, wordLength: wordLength });
  } catch (err) {
    throw err;
  }
});

// Route to guess a letter (passing id as a param and the letter as "guess" in body), sends back an array of the correct indexes of the word
recordRoutes.route("/guessLetter/:id").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("scores").findOne(myquery);

    const word = result.word.split('');
    const correctIndexes = []
    word.forEach((char, index) => {
      if (char.toUpperCase() === req.body.guess.toUpperCase()) {
        correctIndexes.push(index);
      }
    });

    let newvalues = {
      $inc: {
        totalGuessCt: 1,
      },
    };
    if (correctIndexes.length == 0) {
      newvalues = {
        $inc: {
          totalGuessCt: 1,
          incorrectGuessCt: 1,
        },
      };
    }

    await db_connect.collection("scores").updateOne(myquery, newvalues);

    res.json({ correctIndexes: correctIndexes });
  } catch (err) {
    throw err;
  }
});

// Ends the game and sends back the correct word
recordRoutes.route("/endGame/:id").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("scores").findOne(myquery);

    if (req.body.gameWin) {
      await db_connect.collection("scores").updateOne(myquery, { $set: {gameWin: true }});
    }

    const word = result.word;
    res.json({ word: word });
  } catch (err) {
    throw err;
  }
});

module.exports = recordRoutes;