import { useState } from "react";
import { Vector3 } from "three";

const AddCube = ({ addCube }) => {
  const [length, setLength] = useState(5);
  const [xAxis, setXAxis] = useState(5);
  const [yAxis, setYAxis] = useState(5);
  const [zAxis, setZAxis] = useState(5);

  const handleInputChange = (event, setter) => {
    setter(Number(event.target.value));
  };

  const handleAddCube = () => {
    // Calculate cube points based on length and coordinates
    const cubePoints = [
      new Vector3(xAxis, yAxis, zAxis),
      new Vector3(xAxis + length, yAxis, zAxis),
      new Vector3(xAxis + length, yAxis + length, zAxis),
      new Vector3(xAxis, yAxis + length, zAxis),
      new Vector3(xAxis, yAxis, zAxis + length),
      new Vector3(xAxis + length, yAxis, zAxis + length),
      new Vector3(xAxis + length, yAxis + length, zAxis + length),
      new Vector3(xAxis, yAxis + length, zAxis + length),
    ];

    // Define faces of the cube based on points
    const cubeFaces = [
      [
        cubePoints[0],
        cubePoints[1],
        cubePoints[2],
        cubePoints[3],
        cubePoints[0],
      ],
      [
        cubePoints[4],
        cubePoints[5],
        cubePoints[6],
        cubePoints[7],
        cubePoints[4],
      ],
      [
        cubePoints[0],
        cubePoints[3],
        cubePoints[7],
        cubePoints[4],
        cubePoints[0],
      ],
      [
        cubePoints[1],
        cubePoints[2],
        cubePoints[6],
        cubePoints[5],
        cubePoints[1],
      ],
      [
        cubePoints[2],
        cubePoints[3],
        cubePoints[7],
        cubePoints[6],
        cubePoints[2],
      ],
      [
        cubePoints[0],
        cubePoints[1],
        cubePoints[5],
        cubePoints[4],
        cubePoints[0],
      ],
    ];

    // Add cube to the scene
    addCube(cubeFaces);

    setLength(getRandomValue(5, 15));
    setXAxis(getRandomValue(5, 300));
    setYAxis(getRandomValue(5, 300));
    setZAxis(getRandomValue(5, 300));
  };

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <div>
      <h2>Add a New Cube</h2>
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
      <label>
        Z Axis:
        <input
          type="number"
          value={zAxis}
          onChange={(event) => handleInputChange(event, setZAxis)}
        />
      </label>
      <button onClick={handleAddCube}>Submit</button>
    </div>
  );
};

export default AddCube;
