import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/leaderboard`)
      .then((response) => response.json())
      .then((data) => setTopPlayers(data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={player._id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">
        <button>Start Game</button>
      </Link>
    </div>
  );
}

export default Leaderboard;
