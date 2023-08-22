import React from "react";
import {
  BrowserRouter,
  Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/leaderboard" element={<Leaderboard />}></Route>
          <Route path="/" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
