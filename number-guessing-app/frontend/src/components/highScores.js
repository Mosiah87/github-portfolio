import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ScoreRow = (props) => (
    <tr>
        <td>{props.score.name}</td>
        <td>{props.score.score}</td>
    </tr>
);

export default function HighScores() {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function getScores() {
            const response = await fetch(`http://localhost:5000/scores`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const scores = await response.json();
            setScores(scores);
        }

        getScores();
        return;
    }, [scores.length]);

    function scoreList() {
        return scores.map((score) => {
            return(
                <ScoreRow
                  score={score}
                />
            );
        });
    }

    return (
        <div className="container">
            <h3>High Scores</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number of Guesses</th>
                    </tr>
                </thead>
                <tbody>{scoreList()}</tbody>
            </table>
            <Link className="btn btn-link" to={"/"}>Return to Start</Link>
        </div>
    )
}