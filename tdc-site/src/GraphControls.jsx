// GraphControls.jsx
import { useState } from "react";
import { Vector3 } from "three";
// import AddSquare from "./AddSquare";

const GraphControls = ({ addPoint }) => {
  const [newPoint, setNewPoint] = useState({ x: 0, y: 0, z: 0 });

  const handleInputChange = (e) => {
    setNewPoint({
      ...newPoint,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleAddPoint = () => {
    addPoint(new Vector3(newPoint.x, newPoint.y, newPoint.z));
    // Clear input fields after adding a point
    setNewPoint({ x: 0, y: 0, z: 0 });
  };

  return (
    <div className="fixed top-2">
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
      {/* <AddSquare addSquare={addSquare} /> */}
    </div>
  );
};

export default GraphControls;
