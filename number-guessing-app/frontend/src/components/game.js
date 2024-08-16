import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import "bootstrap/dist/css/bootstrap.css";

function Results(props) {
    if (props.visible){
        return (
            <div>
                <p>You guessed the right number in {props.numGuesses} guesses</p>
                <br/>
                <Link className="btn btn-link" to={"/highscores"}>View High Scores</Link>
                <text> | </text>
                <Link className="btn btn-link" to={"/"}>Return to Start</Link>
            </div>
        );
    }
    else {
        return;
    }
}

export default function Game() {
    const [message, setMessage] = useState("");
    const [guess, setGuess] = useState("");
    const [resultsDisplay, setResultsDisplay] = useState(false);
    const [results, setResults] = useState({
        name: "",
        score: "",
        number: "",
    });
    const params = useParams();

    async function onSubmit(e) {
        e.preventDefault();

        if(message === "You Win!") {
            return;
        }

        if(!guess || guess === "") {
            window.alert("Please enter a valid number");
        }
        else {
            await fetch(`http://localhost:5000/guess/${guess}/${params.id.toString()}`)
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
            })
            .catch(error => {
                window.alert(error);
                return;
            });
        }

        setGuess("");
    }

    useEffect(() => {
        async function getResults() {
            const response = await fetch(`http://localhost:5000/scores/${params.id.toString()}`);
            if (!response.ok) {
                const error = `An error occurred: ${response.statusText}`;
                window.alert(error);
                return;
            }
            const scores = await response.json();
            setResults(scores);
        }

        if (message === "You Win!") {
            getResults();
            setResultsDisplay(true);
        }
    }, [message, params.id]);

    const handleChange = event => {
        if(message === "You Win!") {
            return;
        }

        const re = /^$|^(?:100|[1-9]\d?)$/;

        if (re.test(event.target.value)) {
            setGuess(event.target.value);
        }
    };

    return(
        <div className="container">
            <h2 className="h2">Guess a number 1-100:</h2>
            <form onSubmit={onSubmit}>
                <div class="input-group mb-3">
                    <input 
                      type="text" 
                      className="form-control"
                      value={guess} 
                      onChange={handleChange}      
                    />
                    <button className="btn btn-outline-primary" type="submit">Submit</button>
                </div>
            </form>
            <p>{message}</p>
            <br/>
            <Results visible={resultsDisplay} numGuesses={results.score}/>
        </div>
    )
}