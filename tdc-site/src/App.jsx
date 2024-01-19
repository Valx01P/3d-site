import React, { useState } from "react";
import ThreeScene from "./ThreeScene";
import GraphControls from "./GraphControls";
import { Vector3 } from "three";

function App() {
  const [points, setPoints] = useState([]);
  const [squares, setSquares] = useState([]);

  const addPoint = (newPoint) => {
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  const addSquare = (squarePoints) => {
    setSquares((prevSquares) => [...prevSquares, squarePoints]);
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <GraphControls addPoint={addPoint} />
      </div>
      <div className="flex justify-center p-12 mt-3">
        <ThreeScene points={points} squares={squares} addSquare={addSquare} />
      </div>
    </>
  );
}

export default App;
