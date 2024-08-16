import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
 // We import all the components we need in our app
import Game from "./components/game";
import GameHistory from "./components/gameHistory";

 const App = () => {
 return (
  <div>
    <Routes>
      <Route exact path="/" element={<Game />} />
      <Route path="/gameHistory/:name" element={< GameHistory />} />
    </Routes>
  </div>
 );
};

export default App;