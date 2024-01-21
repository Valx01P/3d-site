import React, { useState } from "react";
import ThreeScene from "./ThreeScene";
import GraphControls from "./GraphControls";
import { Vector3 } from "three";
import AddSquare from "./AddSquare";
import AddCube from "./AddCube";

function App() {
  const [points, setPoints] = useState([]);
  const [squares, setSquares] = useState([]);
  const [cubes, setCubes] = useState([]);

  const addPoint = (newPoint) => {
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  const addSquare = (squarePoints) => {
    setSquares((prevSquares) => [...prevSquares, squarePoints]);
  };

  const addCube = (cubeFaces) => {
    setCubes((prevCubes) => [...prevCubes, cubeFaces]);
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <GraphControls addPoint={addPoint} />
      </div>
      <div className="flex justify-center items-center p-12 mt-3 flex-col">
        <ThreeScene
          points={points}
          squares={squares}
          cubes={cubes}
          addSquare={addSquare}
          addCube={addCube}
        />
      </div>
    </>
  );
}

export default App;
