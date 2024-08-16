import { useState } from 'react';

function Square({value, onSquareClick, state}){
  let textColor;
  if(value === "R"){
    textColor = "red";
  }else{
    textColor = "black";
  }

  return (
    <button className="square" onClick={onSquareClick} style={{ color: textColor }}>
        {state}
    </button>
  );
}

export default function Board() {
  const [redIsNext, setRedIsNext] = useState(true);

  const [squares, setSquares] = useState(Array(42).fill(null));

  const [rowCounts, setRowCounts] = useState(Array(7).fill(0));

  const [boardstate, setBoardState] = useState(Array(42).fill(null));

  //i is the column that was clicked
  function handleClick(i) {
    if (rowCounts[i] === 6 || calculateWinner(squares)) {
      return;
    }

    //sets the correct empty square index for the column clicked
    let index = i;
    for (let j = 0; j > (rowCounts[i] - 5); j--) {
      index += 7;
    }
    //updates the number of plays in the clicked column
    const newCounts = rowCounts.slice();
    newCounts[i]++;

    //updates the actual board array
    const newBoardState = boardstate.slice();
    newBoardState[index] = "O";
    
    //updates the colors of the board array
    const nextSquares = squares.slice();
    if(redIsNext) {
      nextSquares[index] = "R";
    } else {
      nextSquares[index] = "B";
    }

    setRowCounts(newCounts);
    setSquares(nextSquares);
    setRedIsNext(!redIsNext);
    setBoardState(newBoardState);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    for (let i = 0; i < rowCounts.length; i++) {
      if(rowCounts[i] !== 6){
        break;
      } else if(i === 6) {
        status = "It's a tie!";
      }
    }

    if(!status){
      status = "Next player: " + (redIsNext ? "Red" : "Black");
    }
  }

  return (
    <>
      <h1>{status}</h1>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} state={boardstate[0]}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} state={boardstate[1]}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} state={boardstate[2]}/>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} state={boardstate[3]}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} state={boardstate[4]}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} state={boardstate[5]}/>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} state={boardstate[6]}/>
      </div>
      <div className="board-row">
        <Square value={squares[7]} onSquareClick={() => handleClick(0)} state={boardstate[7]}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(1)} state={boardstate[8]}/>
        <Square value={squares[9]} onSquareClick={() => handleClick(2)} state={boardstate[9]}/>
        <Square value={squares[10]} onSquareClick={() => handleClick(3)} state={boardstate[10]}/>
        <Square value={squares[11]} onSquareClick={() => handleClick(4)} state={boardstate[11]}/>
        <Square value={squares[12]} onSquareClick={() => handleClick(5)} state={boardstate[12]}/>
        <Square value={squares[13]} onSquareClick={() => handleClick(6)} state={boardstate[13]}/>
      </div>
      <div className="board-row">
        <Square value={squares[14]} onSquareClick={() => handleClick(0)} state={boardstate[14]}/>
        <Square value={squares[15]} onSquareClick={() => handleClick(1)} state={boardstate[15]}/>
        <Square value={squares[16]} onSquareClick={() => handleClick(2)} state={boardstate[16]}/>
        <Square value={squares[17]} onSquareClick={() => handleClick(3)} state={boardstate[17]}/>
        <Square value={squares[18]} onSquareClick={() => handleClick(4)} state={boardstate[18]}/>
        <Square value={squares[19]} onSquareClick={() => handleClick(5)} state={boardstate[19]}/>
        <Square value={squares[20]} onSquareClick={() => handleClick(6)} state={boardstate[20]}/>
      </div>
      <div className="board-row">
        <Square value={squares[21]} onSquareClick={() => handleClick(0)} state={boardstate[21]}/>
        <Square value={squares[22]} onSquareClick={() => handleClick(1)} state={boardstate[22]}/>
        <Square value={squares[23]} onSquareClick={() => handleClick(2)} state={boardstate[23]}/>
        <Square value={squares[24]} onSquareClick={() => handleClick(3)} state={boardstate[24]}/>
        <Square value={squares[25]} onSquareClick={() => handleClick(4)} state={boardstate[25]}/>
        <Square value={squares[26]} onSquareClick={() => handleClick(5)} state={boardstate[26]}/>
        <Square value={squares[27]} onSquareClick={() => handleClick(6)} state={boardstate[27]}/>
      </div>
      <div className="board-row">
        <Square value={squares[28]} onSquareClick={() => handleClick(0)} state={boardstate[28]}/>
        <Square value={squares[29]} onSquareClick={() => handleClick(1)} state={boardstate[29]}/>
        <Square value={squares[30]} onSquareClick={() => handleClick(2)} state={boardstate[30]}/>
        <Square value={squares[31]} onSquareClick={() => handleClick(3)} state={boardstate[31]}/>
        <Square value={squares[32]} onSquareClick={() => handleClick(4)} state={boardstate[32]}/>
        <Square value={squares[33]} onSquareClick={() => handleClick(5)} state={boardstate[33]}/>
        <Square value={squares[34]} onSquareClick={() => handleClick(6)} state={boardstate[34]}/>
      </div>
      <div className="board-row">
        <Square value={squares[35]} onSquareClick={() => handleClick(0)} state={boardstate[35]}/>
        <Square value={squares[36]} onSquareClick={() => handleClick(1)} state={boardstate[36]}/>
        <Square value={squares[37]} onSquareClick={() => handleClick(2)} state={boardstate[37]}/>
        <Square value={squares[38]} onSquareClick={() => handleClick(3)} state={boardstate[38]}/>
        <Square value={squares[39]} onSquareClick={() => handleClick(4)} state={boardstate[39]}/>
        <Square value={squares[40]} onSquareClick={() => handleClick(5)} state={boardstate[40]}/>
        <Square value={squares[41]} onSquareClick={() => handleClick(6)} state={boardstate[41]}/>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  //Check horizontal wins
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        squares[row * 7 + col] &&
        squares[row * 7 + col] === squares[row * 7 + col + 1] &&
        squares[row * 7 + col] === squares[row * 7 + col + 2] &&
        squares[row * 7 + col] === squares[row * 7 + col + 3]
      ) {
        //Winner found
        if(squares[row * 7 + col] === "R") {
          return "Red";
        } else {
          return "Black";
        }
      }
    }
  }

  //Check vertical wins
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        squares[row * 7 + col] &&
        squares[row * 7 + col] === squares[(row + 1) * 7 + col] &&
        squares[row * 7 + col] === squares[(row + 2) * 7 + col] &&
        squares[row * 7 + col] === squares[(row + 3) * 7 + col]
      ) {
        //Winner found
        if(squares[row * 7 + col] === "R") {
          return "Red";
        } else {
          return "Black";
        }
      }
    }
  }

  //Check diagonal wins, left to right
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        squares[row * 7 + col] &&
        squares[row * 7 + col] === squares[(row + 1) * 7 + col + 1] &&
        squares[row * 7 + col] === squares[(row + 2) * 7 + col + 2] &&
        squares[row * 7 + col] === squares[(row + 3) * 7 + col + 3]
      ) {
        //Winner found
        if(squares[row * 7 + col] === "R") {
          return "Red";
        } else {
          return "Black";
        }
      }
    }
  }

  //Check diagonal wins, right to left
  for (let row = 0; row < 3; row++) {
    for (let col = 3; col < 7; col++) {
      if (
        squares[row * 7 + col] &&
        squares[row * 7 + col] === squares[(row + 1) * 7 + col - 1] &&
        squares[row * 7 + col] === squares[(row + 2) * 7 + col - 2] &&
        squares[row * 7 + col] === squares[(row + 3) * 7 + col - 3]
      ) {
        //Winner found
        if(squares[row * 7 + col] === "R") {
          return "Red";
        } else {
          return "Black";
        }
      }
    }
  }

  return null;
}