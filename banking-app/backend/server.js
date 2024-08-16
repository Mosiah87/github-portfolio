const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env"});

const session = require('express-session');  // new
const MongoStore = require('connect-mongo'); // new

const port = process.env.PORT || 5000;
//Changed this to make sessions work, also have to have `credentials: "include"` for frontend fetches
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

const uri = process.env.ATLAS_URI + "bankingapp";
// Advanced usage
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //save session if unmodified
  cookie: {
    expires: (new Date(Date.now() + 24 * 60 * 60 * 1000 * 7)) // 1 week
  },
  store: MongoStore.create({
    mongoUrl: uri,
    collectionName: "sessions"
  })
}));

app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");
app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`);
});