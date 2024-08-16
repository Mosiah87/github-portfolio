import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import io from 'socket.io-client';
import { DndContext } from '@dnd-kit/core';
import "bootstrap/dist/css/bootstrap.css";
import Card from "./card";
import Pile from "./pile";

// To connect on two different machines, find host name of machine running the app (run hostname in command prompt)
// then instead of http://localhost:3000, go to http://{hostname}:3000, replacing '{hostname}' with the actual host name
const socket = io(`http://${window.location.hostname}:5000`, {
  withCredentials: true,
  transports: ["websocket"]
});

export default function Game() {
    const [piles, setPiles] = useState([
        {id: 1, cards: []},
        {id: 2, cards: []},
        {id: 3, cards: []},
        {id: 4, cards: []},
        {id: 5, cards: []},
        {id: 6, cards: []},
        {id: 7, cards: []},
        {id: 8, cards: []},
    ]);
    const [player, setPlayer] = useState();
    const [topCards, setTopCards] = useState([]);
    const [bottomCards, setBottomCards] = useState([]);
    const [validPlays, setValidPlays] = useState([]);
    const [playerName, setPlayerName] = useState();
    const [disabled, setDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('gameState', (gameState) => {
            setPlayer(gameState.players[socket.id]);
            setPiles(gameState.piles);
            setTopCards(gameState.players[socket.id] === 1 ? gameState.playerTwoHand : gameState.playerOneHand);
            setBottomCards(gameState.players[socket.id] === 1 ? gameState.playerOneHand : gameState.playerTwoHand);
            setValidPlays(gameState.validPlays);
        });
        socket.on('gameOver', (playerInfo) => {
            setValidPlays([]);

            console.log(playerInfo);

            setMessage("Player " + playerInfo.winningPlayerNum + " Wins!")
        });
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        // Handles if they don't drop it in a valid place
        if (!over || over.id === 0) return;
        
        if (message.startsWith("Invalid")) {
            setMessage("");
        }
    
        // Check if the move is valid according to game rules
        const isValidMove = checkValidMove(over.id);
    
        if (!isValidMove) {
            setMessage("Invalid play");
            return;
        }

        // Adds the dragged card to the correct pile's card array
        const updatedPiles = piles.map((pile) => {
            if (pile.id === over.id) {
                return { ...pile, cards: [...pile.cards, active.id] };
            }
            return pile;
        });
    
        setPiles(updatedPiles);
    
        // Removes the dragged card from their hand
        const updatedCards = bottomCards.filter((item) => item !== active.id);
    
        const updatedValidPlays = updateValidPlays(updatedPiles, over.id);
        setValidPlays(updateValidPlays);

    
        console.log("Valid Plays: " + validPlays);

        // Send the new game state to all users
        const gameState = {
            playerNum: player,
            piles: updatedPiles,
            playerHand: updatedCards,
            validPlays: updatedValidPlays 
        };
        socket.emit('updateGameState', gameState);
    }

    function checkValidMove(pileId) {
        // Checks if the player has any empty piles on their side
        const pileCards = piles.find((pile) => pile.id === pileId).cards;
        const haveEmpty = piles.filter((pile) => player === 1 ? (pile.id > 4) : (pile.id < 5)).some((pile) => pile.cards.length === 0);
        if (haveEmpty && (pileCards.length !== 0 || (player === 1 ? (pileId < 5) : (pileId > 4)))) {
            console.log("You cannot play while you still have empty piles");  // Change this to set a state to display and tell the user 
            return false;
        }
            
        // Check if the move is valid according to game rules
        if (player === 1 && pileId < 5 && piles.find(pile => pile.id === pileId).cards.length === 0) {
            return false;
        }

        if (player === 2 && pileId > 4 && piles.find(pile => pile.id === pileId).cards.length === 0) {
            return false;
        }

        // Because of the previous checks, assume at this point that playing on an empty pile is valid
        if (pileCards.length === 0) {
            return true;
        }

        if (!validPlays.some((id) => pileId === id)) {
            return false;
        }
    
        return true;
    }
    
    
    function updateValidPlays(updatedPiles, pileId) {
        console.log(updatedPiles);
        const updatedValidPlays = validPlays;

        // Delete the pile that was just played on from the valid array
        const indexToDelete = updatedValidPlays.indexOf(pileId);
        if (indexToDelete !== -1) {
            updatedValidPlays.splice(indexToDelete, 1);
        }
    
        updatedPiles.forEach(pile => {
            if (pile.cards && pile.cards.length > 0) {
                const topCard = pile.cards[pile.cards.length - 1];
                const topCardPrefix = topCard.substring(0, 2);
    
                // Check if there's at least one other pile with the same prefix
                if (updatedPiles.some(p => p.id !== pile.id && p.cards.length > 0 && p.cards[p.cards.length - 1].startsWith(topCardPrefix)) && !updatedValidPlays.includes(pile.id)) {
                    updatedValidPlays.push(pile.id);
                }
            }
        });
    
        return updatedValidPlays;
    }

    function draggableMarkup(id, draggable, image) {
        return (
            <Card key={id} id={id} draggable={draggable} image={image ? image : id}/>
        );
    }

    function handleShuffle() {
        setMessage("");
        socket.emit('shufflePiles');
    }
    

    function Board() {
        return (
            <DndContext onDragEnd={handleDragEnd}>
                <div className="row justify-content-center">
                    <Pile key={0} id={0}>
                        {Array.from({ length: topCards.length }).map(() => draggableMarkup(null, false, 'pokemon'))}
                    </Pile>
                </div>

                <div className="row justify-content-center flex-nowrap">
                    {piles.filter((pile) =>  player === 1 ? (pile.id < 5) : (pile.id > 4)).map((pile) => (
                        <Pile key={pile.id} id={pile.id}>
                            {pile.cards.map((card) => draggableMarkup(card, false))}
                        </Pile>
                    ))}
                </div>
                <div className="row justify-content-center flex-nowrap">
                    {piles.filter((pile) => player === 1 ? (pile.id > 4) : (pile.id < 5)).map((pile) => (
                        <Pile key={pile.id} id={pile.id}>
                            {pile.cards.map((card) => draggableMarkup(card, false))}
                        </Pile>
                    ))}
                </div>

                <div className="row justify-content-center">
                    <Pile key={0} id={0}>
                        {bottomCards.map((card, index) => index === bottomCards.length - 1 ? draggableMarkup(card, ((bottomCards.length === 0 || topCards.length === 0) ? false : true), 'pokemon') : draggableMarkup(card, false, 'pokemon'))}
                    </Pile>
                </div>
            </DndContext>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (disabled) return;
        setDisabled(false);

        if (!playerName) {
            window.alert("Please enter a name");
            return;
        }

        const newPlayer = {
            name: playerName,
            loserCardCount: bottomCards.length === 0 ? topCards.length : bottomCards.length,
            date: new Date(),
            win: bottomCards.length === 0 ? true : false
        }

        const response = await fetch(`http://${window.location.hostname}:5000/storeGameData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPlayer)
        });
        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        navigate(`/gameHistory/${playerName}`);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col"></div>
                
                <div className="col-8">
                    <Board />
                    <div className="row justify-content-center">Player {player}</div>
                    <div className="row justify-content-center">Cards in hand: {bottomCards.length}</div>
                </div>

                <div className="col align-self-center">
                    <h6 className={message.startsWith("Invalid") ? "text-danger" : "text-success"}>{message}</h6>
                    <br/>
                    {/* Render shuffle button if there are no valid plays */}
                    {(validPlays.length === 0 && !piles.some((pile) => pile.cards.length === 0) && !message.startsWith("Player")) && (
                        <button className="btn btn-primary" onClick={handleShuffle}>Shuffle Cards</button>
                    )}
                    {(bottomCards.length === 0 || topCards.length === 0) && (
                        <form onSubmit={handleSubmit}>
                            Enter your name to keep track of your game history
                            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter your name" />
                            <button type="submit">Submit</button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}