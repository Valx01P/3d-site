import React, { useState } from "react";
import { Vector3 } from "three";

const AddSquare = ({ addSquare }) => {
  const [length, setLength] = useState(1);

  const handleInputChange = (e) => {
    setLength(parseFloat(e.target.value));
  };

  const handleAddSquare = () => {
    // Calculate square points based on length
    const squarePoints = [
      new Vector3(0, 0, 0),
      new Vector3(length, 0, 0),
      new Vector3(length, length, 0),
      new Vector3(0, length, 0),
    ];

    // Add square to the scene
    addSquare(squarePoints);

    // Clear input field after adding a square
    setLength(1);
  };

  return (
    <div>
      <h2>Add a New Square</h2>
      <label>
        Length:
        <input type="number" value={length} onChange={handleInputChange} />
      </label>
      <button onClick={handleAddSquare}>Submit</button>
    </div>
  );
};

export default AddSquare;
