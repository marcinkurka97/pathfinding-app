import React from "react";
import PathfindingVisualizer from "./Pathfinding/PathfindingVisualizer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pathfinding visualization</h1>
      </header>
      <section className="App-container">
        <PathfindingVisualizer></PathfindingVisualizer>
      </section>
    </div>
  );
}

export default App;
