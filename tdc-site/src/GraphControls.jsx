import { useState } from "react";
import { Vector3 } from "three";

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const GraphControls = ({ addPoint }) => {
  const [newPoint, setNewPoint] = useState({ x: 5, y: 5, z: 0 });

  const handleInputChange = (e) => {
    setNewPoint({
      ...newPoint,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleAddPoint = () => {
    addPoint(new Vector3(newPoint.x, newPoint.y, newPoint.z));
    // Clear input fields after adding a point
    setNewPoint({
      x: getRandomValue(1, 100),
      y: getRandomValue(1, 100),
      z: getRandomValue(1, 100),
    });
  };

  return (
    <div>
      <h2>Add a New Point</h2>
      <label>
        X:
        <input
          type="number"
          name="x"
          value={newPoint.x}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Y:
        <input
          type="number"
          name="y"
          value={newPoint.y}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Z:
        <input
          type="number"
          name="z"
          value={newPoint.z}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleAddPoint}>Add Point</button>
    </div>
  );
};

export default GraphControls;
