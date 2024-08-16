import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Route, Routes } from "react-router-dom";
import Name from "./components/name";
import Game from "./components/game"
import HighScores from "./components/highScores";

const App = () => {
  return (
      <Routes>
        <Route exact path="/" element={<Name />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/highscores" element={<HighScores />} />
      </Routes>
  );
};
export default App;