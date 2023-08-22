import { Input, TextField, Button, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
function Game() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [items, setItems] = useState([]);
  const [catcherPosition, setCatcherPosition] = useState(225); // Initial position
  const moveCatcher = (direction) => {
    const newPosition =
      direction === "left" ? catcherPosition - 20 : catcherPosition + 20;

    const minPosition = 0;
    const maxPosition =
      window.innerWidth >= 1024 ? 450 : window.innerWidth - 60;

    if (newPosition >= minPosition && newPosition <= maxPosition) {
      setCatcherPosition(newPosition);
    }
  };
  const [timeLeft, setTimeLeft] = useState(60);
  const itemTypes = ["p1", "p2", "p3", "p4", "e1", "e2"];
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        moveCatcher("left");
      } else if (event.key === "ArrowRight") {
        moveCatcher("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [catcherPosition]);

  useEffect(() => {
    const maxPosition =
      window.innerWidth >= 1024 ? 450 : window.innerWidth - 120;

    if (gameRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        const newItem = {
          id: Date.now(),
          type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
          position: Math.floor(Math.random() * maxPosition),
        };
        setItems((prevItems) => [...prevItems, newItem]);
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setGameRunning(false);
      setMessage("Please enter your name to submit your score.");
    }
  }, [gameRunning, timeLeft]);

  const startGame = () => {
    setGameRunning(true);
    setTimeLeft(60);
    setScore(0);
    setItems([]);
  };
  const submitScore = async () => {
    setMessage("");
    if (name && score !== 0) {
      const response = await fetch(`${backendUrl}/addPlayer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, score }),
      });

      if (response.ok) {
        console.log("Score submitted successfully");
      }
    }
  };

  const catchItem = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const itemValue = item.type.startsWith("p") ? 50 : 100;
      setScore((prevScore) => prevScore + itemValue);
      setItems((prevItems) =>
        prevItems.filter((prevItem) => prevItem.id !== itemId)
      );
    }
  };

  return (
    <Box>
      <h1>Catch Game</h1>
      <p>Time left: {timeLeft}</p>
      <p>Score: {score}</p>
      {timeLeft === 0 && (
        <form onSubmit={submitScore}>
          <p className="message">{message}</p>
          <TextField
            size="small"
            type="text"
            required
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" sx={{ marginLeft: 1 }} type="submit">
            Submit
          </Button>
        </form>
      )}

      {gameRunning && (
        <div className="game-area">
          {items.map((item) => (
            <div
              key={item.id}
              className={`game-item ${item.type}`}
              style={{ left: item.position }}
              onClick={() => catchItem(item.id)}
            />
          ))}
        </div>
      )}
      <Box
        sx={{ padding: 5, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <button sx={{ margin: 5 }} onClick={startGame}>
          Start Game
        </button>
        <Link to="/leaderboard">
          <button>Leaderboard</button>
        </Link>
      </Box>
    </Box>
  );
}
export default Game;
