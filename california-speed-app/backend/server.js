const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env"});

// Sockets
const socketio = require('socket.io');
const server = require('http').Server(app);
const io = socketio(server);

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");
server.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`);
});

// Socket.IO
let players = {};
let gameState;
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  // Set player number
  if (Object.keys(players).length === 0) {
    players[socket.id] = 1;
  } else {
    for (const key in players) {
      if (players[key] === 1) {
        players[socket.id] = 2;
        break;
      } else if (players[key] === 2) {
        players[socket.id] = 1;
        break;
      }
    }
  }

  // Initialize the game state
  if (!gameState) {
    const CardsList = [
      "01c",
      "01d",
      "01h",
      "01s",
      "02c",
      "02d",
      "02h",
      "02s",
      "03c",
      "03d",
      "03h",
      "03s",
      "04c",
      "04d",
      "04h",
      "04s",
      "05c",
      "05d",
      "05h",
      "05s",
      "06c",
      "06d",
      "06h",
      "06s",
      "07c",
      "07d",
      "07h",
      "07s",
      "08c",
      "08d",
      "08h",
      "08s",
      "09c",
      "09d",
      "09h",
      "09s",
      "10c",
      "10d",
      "10h",
      "10s",
      "11c",
      "11d",
      "11h",
      "11s",
      "12c",
      "12d",
      "12h",
      "12s",
      "13c",
      "13d",
      "13h",
      "13s",
    ];

    const shuffledArray = [...CardsList];
    
    // Shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // Divide shuffled pile into to equal piles
    const playerOneHand = [];
    for (let i = 0; i < 26; i++) {
        playerOneHand.push(shuffledArray[i]);
    }
    const playerTwoHand = shuffledArray.slice(26, 52);

    gameState = {
      players: players,
      piles: [
        {id: 1, cards: []},
        {id: 2, cards: []},
        {id: 3, cards: []},
        {id: 4, cards: []},
        {id: 5, cards: []},
        {id: 6, cards: []},
        {id: 7, cards: []},
        {id: 8, cards: []}
      ],
      playerOneHand: playerOneHand,
      playerTwoHand: playerTwoHand,
      validPlays: [],
    };
  }
  // Send the game state when they connect
  socket.emit('gameState', gameState);

  // Send out game over if the game is already over
  if (gameState.playerOneHand.length === 0) {
    const playerInfo = {
      players: players,
      winningPlayerNum: 1
    }

    io.emit('gameOver', playerInfo);
  } else if (gameState.playerTwoHand.length === 0) {
    const playerInfo = {
      players: players,
      winningPlayerNum: 2
    }

    io.emit('gameOver', playerInfo);
  }

  // Makes a new game
  socket.on('newGame', () => {
    gameState = {};
    const CardsList = [
      "01c",
      "01d",
      "01h",
      "01s",
      "02c",
      "02d",
      "02h",
      "02s",
      "03c",
      "03d",
      "03h",
      "03s",
      "04c",
      "04d",
      "04h",
      "04s",
      "05c",
      "05d",
      "05h",
      "05s",
      "06c",
      "06d",
      "06h",
      "06s",
      "07c",
      "07d",
      "07h",
      "07s",
      "08c",
      "08d",
      "08h",
      "08s",
      "09c",
      "09d",
      "09h",
      "09s",
      "10c",
      "10d",
      "10h",
      "10s",
      "11c",
      "11d",
      "11h",
      "11s",
      "12c",
      "12d",
      "12h",
      "12s",
      "13c",
      "13d",
      "13h",
      "13s",
    ];

    const shuffledArray = [...CardsList];
    
    // Shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // Divide shuffled pile into to equal piles
    const playerOneHand = [];
    for (let i = 0; i < 26; i++) {
        playerOneHand.push(shuffledArray[i]);
    }
    const playerTwoHand = shuffledArray.slice(26, 52);

    gameState = {
      players: players,
      piles: [
        {id: 1, cards: []},
        {id: 2, cards: []},
        {id: 3, cards: []},
        {id: 4, cards: []},
        {id: 5, cards: []},
        {id: 6, cards: []},
        {id: 7, cards: []},
        {id: 8, cards: []}
      ],
      playerOneHand: playerOneHand,
      playerTwoHand: playerTwoHand,
      validPlays: [],
    };

    io.emit('gameState', gameState);
  });

  // Sends the game state back
  socket.on('getGameState', () => {
    socket.emit('gameState', gameState);
  });

  // Updates the game state and sends it back to every user
  socket.on('updateGameState', (updatedGame) => {
    if(updatedGame.playerNum < 2) {
      // Player 1 updates the state
      gameState = {
        ...gameState,
        playerOneHand: updatedGame.playerHand,
        validPlays: updatedGame.validPlays
      }
    } else {
      // Player 2 updates the state
      gameState = {
        ...gameState,
        playerTwoHand: updatedGame.playerHand,
        validPlays: updatedGame.validPlays
      }
    }

    // Merge updated piles with existing piles
    updatedGame.piles.forEach((updatedPile) => {
      const index = gameState.piles.findIndex((pile) => pile.id === updatedPile.id);
      if (index !== -1) {
        updatedPile.cards.forEach((card) => {
          if (!gameState.piles[index].cards.some((existingCard) => existingCard === card)) {
              gameState.piles[index].cards.push(card);
          }
        });
      }
    });

    // io.emit sends it to everyone, socket.emit only sends it back to the specific socket
    io.emit('gameState', gameState);

    if (gameState.playerOneHand.length === 0) {
      const playerInfo = {
        players: players,
        winningPlayerNum: 1
      }

      io.emit('gameOver', playerInfo);
    } else if (gameState.playerTwoHand.length === 0) {
      const playerInfo = {
        players: players,
        winningPlayerNum: 2
      }

      io.emit('gameOver', playerInfo);
    }
  });

  // Shuffles each players closest piles into their hands
  socket.on('shufflePiles', () => {
    // Combine cards from piles 1 to 4 and 5 to 8
    const shuffledP1Cards = gameState.playerOneHand;
    const shuffledP2Cards = gameState.playerTwoHand;
    gameState.piles.forEach(pile => {
        if (pile.id > 4) {
            shuffledP1Cards.push(...pile.cards);
        } else {
            shuffledP2Cards.push(...pile.cards);
        }
    });

    // Shuffle bottom cards
    for (let i = shuffledP1Cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledP1Cards[i], shuffledP1Cards[j]] = [shuffledP1Cards[j], shuffledP1Cards[i]];
    }

    // Shuffle top cards
    for (let i = shuffledP2Cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledP2Cards[i], shuffledP2Cards[j]] = [shuffledP2Cards[j], shuffledP2Cards[i]];
    }

    gameState = {
      ...gameState,
      piles: [
        {id: 1, cards: []},
        {id: 2, cards: []},
        {id: 3, cards: []},
        {id: 4, cards: []},
        {id: 5, cards: []},
        {id: 6, cards: []},
        {id: 7, cards: []},
        {id: 8, cards: []}
      ],
      playerOneHand: shuffledP1Cards,
      playerTwoHand: shuffledP2Cards,
      validPlays: []
    };

    io.emit('gameState', gameState);
  });

  // Disconnects them and removes them from players, called automatically
  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log(`Socket ${socket.id} disconnected`);
  });
});