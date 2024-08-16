import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";


const stages = [`
    +---+
    |   |
        |
        |
        |
        |
  =========`,  // Stage 0 

`
    +---+
    |   |
    O   |
        |
        |
        |
  =========`,  // Stage 1 
  
`
    +---+
    |   |
    O   |
    |   |
        |
        |
  =========`,  // Stage 2 
  
`
    +---+
    |   |
    O   |
   /|   |
        |
        |
  =========`,  // Stage 3 

`
    +---+
    |   |
    O   |
   /|\\  |
        |
        |
  =========`,  // Stage 4 
  
`
    +---+
    |   |
    O   |
   /|\\  |
   /    |
        |
  =========`,  // Stage 5

`
    +---+
    |   |
    O   |
   /|\\  |
   / \\  |
        |
  =========`  // Stage 6
  ];

function HangmanDrawing({ incorrectGuessesCount }) {
  const stageToShow = Math.min(incorrectGuessesCount, stages.length - 1);
  return <pre>{stages[stageToShow]}</pre>;
}

export default function Game() {
  const [form, setForm] = useState({
    name: "",
    word: "",
    guessLetter: "",
    guessCt: 0,
    correctGuesses: [],
    incorrectGuesses: [],
  });
  const params = useParams();
  const [status, setStatus] = useState('');
  const [button, setButton] = useState('');
  const [displayedString, setDisplayedString] = useState(["_"]);
  const [wordLength, setWordLength] = useState(0);


  useEffect(() => {
    let temp = [];
    for (let i = 0; i < params.wordLength; i++) {
      temp.push("_");
    }

    setDisplayedString(temp);
  }, []);
 

  const handleGameOver = async (gameWon) => {
    const response = await fetch(`http://localhost:5000/endGame/${params.id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameWin: gameWon }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.word;
      //console.log("Game over. The word was:", data.word);
    } else {
      console.error("Failed to end the game properly.");
    }
  };

  const handleGuessLetter = async () => {
    const updatedGuessCt = form.guessCt + 1;
    let updatedCorrectGuesses = [...form.correctGuesses];
    let updatedIncorrectGuesses = [...form.incorrectGuesses];

    if (!updatedCorrectGuesses.includes(form.guessLetter.toLowerCase()) && !updatedIncorrectGuesses.includes(form.guessLetter.toLowerCase())) {
      const response = await fetch(`http://localhost:5000/guessLetter/${params.id}`, {
        method: "POST",
        body: JSON.stringify({ guess: form.guessLetter }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setStatus("Error fetching status");
        return;
      }

      const { correctIndexes } = await response.json();

      if (correctIndexes.length > 0) {
        updatedCorrectGuesses.push(form.guessLetter.toLowerCase());

        setDisplayedString(prevItems => {
          const newItems = [...prevItems]; // Create a copy of the original array

          for(let i = 0; i < correctIndexes.length; i++) {
            newItems[correctIndexes[i]] = form.guessLetter.toUpperCase(); // Set the new value at the specified index
          }

          return newItems; // Return the new array
        });

          setStatus("Correct!");
      } else {
        updatedIncorrectGuesses.push(form.guessLetter.toLowerCase());

        if(!(form.incorrectGuesses.length >= 6)) {
          setStatus("Incorrect guess. Try again.");
        }
      }
    } else {
      setStatus("You've already guessed that letter. Try a different one.");
      return;  
    }

    setForm({
      ...form,
      guessCt: updatedGuessCt,
      correctGuesses: updatedCorrectGuesses,
      incorrectGuesses: updatedIncorrectGuesses,
      guessLetter: ""
    });


  };

  const handleInputChange = (event) => {
    ///^[a-zA-Z]$/.test(event.target.value) && 
    if ((/^[a-zA-Z]$/.test(event.target.value) || event.target.value === "") && (status.startsWith("Game Over. You've lost!") || status !== "You Won!")) {
      setForm({ ...form, guessLetter: event.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleGuessLetter();
  }; 

  useEffect(() => {
    const checkGameStatus = async () => {
      const checkWin = displayedString.every(char => char !== "_");
      console.log(checkWin);
      const checkLose = form.incorrectGuesses.length >= 6;
      let word = "";

      if(checkWin || checkLose) {
        const response = await fetch(`http://localhost:5000/endGame/${params.id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ gameWin: checkWin }),
        });
    
        if (response.ok) {
          const data = await response.json();
          word = data.word;
          //console.log("Game over. The word was:", data.word);
        } else {
          console.error("Failed to end the game properly.");
        }
      }

      if (checkWin) {
        setStatus("Congratulations! You've won!");
        setButton("active");
      } else if (checkLose) {
        setStatus("Game Over. You've lost! The word was: " + word);
        setButton("active");
      }
    };
  
    checkGameStatus(); 
  }, [form.incorrectGuesses.length, form.correctGuesses.length]);
  
  

  return (
    <div>
      <h3>Hangman Game</h3>
      <HangmanDrawing incorrectGuessesCount={form.incorrectGuesses.length} />
      <div>
        <p>Word Progress: {displayedString.join(" ")}</p>
        <p>Incorrect Guesses: {form.incorrectGuesses.join(', ')}</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="guessLetter">Enter your guess: </label>
          <input
            type="text"
            className="form-control"
            id="guessLetter"
            maxLength={1}
            value={form.guessLetter}
            onChange={handleInputChange}
            disabled={status.startsWith("Game Over. You've lost!") || status === "Congratulations! You've won!"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="guessCt">Guess count: {form.guessCt}</label>
        </div>
        <br />
        <div className="status">{status}</div>
        <br />
        <div className="form-group">
          <input
            type="submit"
            value="Submit Guess"
            className="btn btn-primary"
            disabled={status.startsWith("Game Over. You've lost!") || status === "Congratulations! You've won!"}
          />
        </div>
      </form>
      <div>
      {button && (<Link 
          to={`/`} 
          className="btn btn-outline-primary"
        >Play Again</Link>)}
        {button && (<Link 
          to={`/highscores/${params.wordLength}`} 
          className="btn btn-outline-primary"
        >Go To Highscores</Link>)}
      </div>
    </div>
  );
}