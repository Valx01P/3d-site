import React, { useState } from "react";
import { Vector3 } from "three";

const AddSquare = ({ addSquare }) => {
  const [length, setLength] = useState(4);
  const [xAxis, setXAxis] = useState(5);
  const [yAxis, setYAxis] = useState(5);

  const handleInputChange = (event, setter) => {
    setter(Number(event.target.value));
  };

  const handleAddSquare = () => {
    // Calculate square points based on length
    const squarePoints = [
      new Vector3(xAxis, yAxis, 0),
      new Vector3(xAxis + length, yAxis, 0),
      new Vector3(xAxis + length, yAxis + length, 0),
      new Vector3(xAxis, yAxis + length, 0),
      new Vector3(xAxis, yAxis, 0), // Close the square by connecting back to the starting point
    ];

    // Add square to the scene
    addSquare(squarePoints);

    // Clear input fields after adding a square
    setLength(1);
    setXAxis(0);
    setYAxis(0);
  };

  return (
    <div>
      <h2>Add a New Square</h2>
      <label>
        Length:
        <input
          type="number"
          value={length}
          onChange={(event) => handleInputChange(event, setLength)}
        />
      </label>
      <label>
        X Axis:
        <input
          type="number"
          value={xAxis}
          onChange={(event) => handleInputChange(event, setXAxis)}
        />
      </label>
      <label>
        Y Axis:
        <input
          type="number"
          value={yAxis}
          onChange={(event) => handleInputChange(event, setYAxis)}
        />
      </label>
      <button onClick={handleAddSquare}>Submit</button>
    </div>
  );
};

export default AddSquare;
