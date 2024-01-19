// App.jsx
import { useState } from "react";
import ThreeScene from "./ThreeScene";
import GraphControls from "./GraphControls";
import { Vector3 } from "three";

function App() {
  const [points, setPoints] = useState([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 20),
    new Vector3(20, 0, 0),
    new Vector3(0, 20, 0),
  ]);

  const addPoint = (newPoint) => {
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <GraphControls addPoint={addPoint} />
      </div>
      <div className="flex justify-center p-12 mt-3">
        <ThreeScene points={points} />
      </div>
    </>
  );
}

export default App;
