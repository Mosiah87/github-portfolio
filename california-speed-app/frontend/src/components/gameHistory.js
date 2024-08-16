import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";

const socket = io(`http://${window.location.hostname}:5000`, {
  withCredentials: true,
  transports: ["websocket"]
});

function GameInfo(props) {
    const date = new Date(props.game.date);

    return (
        <tr>
            <td>{date.toLocaleString()}</td>
            <td>{props.game.win ? "Win" : "Loss"}</td>
            <td>{props.game.loserCardCount}</td>
        </tr>
    );
}

export default function GameHistory() {
    const [gameHistory, setGameHistory] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGameHistory() {
            const player = {
                name: params.name
            };

            const response = await fetch(`http://${window.location.hostname}:5000/getPlayer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(player)
            });
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const user = await response.json();
            setGameHistory(user.games.reverse());
        }

        fetchGameHistory();
    }, [params.name]);

    function handleSubmit(e) {
        e.preventDefault();

        socket.emit('newGame');
        navigate("/");
    }

    function gameHistoryTable () {
        return gameHistory.map((game) => {
            return (
              <GameInfo
                game={game}
              />
            );
          });
    }

    return (
        <div className="container">
            <nav className="navbar">
                <div className="container-fluid justify-content-end">
                    <button className="btn btn-outline-success" onClick={handleSubmit}>New Game</button>
                </div>
            </nav>
            <h3>{params.name}'s Speed Game History</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Win/Loss</th>
                    <th>Loser's Remaining Hand Size</th>
                </tr>
                </thead>
                <tbody>{gameHistoryTable()}</tbody>
            </table>
        </div>
    );
}
