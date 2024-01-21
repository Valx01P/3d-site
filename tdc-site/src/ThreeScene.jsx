import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Points, Html, Sky } from "@react-three/drei";
import { Physics, usePlane, useSphere } from "@react-three/cannon";
import { Vector3, Raycaster } from "three";
import AddSquare from "./AddSquare";
import AddCube from "./AddCube";

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

const Cube = ({ cubeFaces }) => {
  return (
    <group>
      {cubeFaces.map((facePoints, index) => (
        <Square key={index} squarePoints={facePoints} />
      ))}
    </group>
  );
};

const DragCube = ({ setDragging }) => {
  const meshRef = useRef();
  const { camera } = useThree();
  const [dragging, setLocalDragging] = useState(false);
  const [position, setPosition] = useState([5, 5, 5]); // Initial position

  const raycaster = new Raycaster();
  const mouse = new Vector3();

  const handleMouseDown = (event) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    setLocalDragging(true);
    setDragging(true);
  };

  const handleMouseUp = () => {
    setLocalDragging(false);
    setDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;

    const { clientX, clientY } = event;
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const { point } = intersects[0];
      setPosition([point.x, point.y, point.z]); // Update position based on intersection point
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => console.log("Cube clicked")}
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerMove={handleMouseMove}
      scale={dragging ? [1.5, 1.5, 1.5] : [1, 1, 1]} // Make the cube larger when dragging
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

function Sphere(props) {
  const [ref] = useSphere(() => ({ mass: getRandomValue(1, 2), ...props }));
  return (
    <mesh castShadow ref={ref}>
      <sphereGeometry args={[getRandomValue(1, 3), 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

const ThreeScene = ({ points, squares, cubes, addSquare, addCube }) => {
  const handleResetCamera = useRef(() => {});
  const [axisLength, setAxisLength] = useState(20);
  const [ready, set] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 1000);
    return () => clearTimeout(timeout);
  }, []);
  const [spheres, setSpheres] = useState([]);
  const [dragging, setDragging] = useState(false);
  const orbitControlsRef = useRef();
  useEffect(() => {
    // Update OrbitControls enabled status based on dragging
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !dragging;
    }
  }, [dragging]);

  const dropSphere = () => {
    setSpheres((oldSpheres) => [
      ...oldSpheres,
      {
        position: [
          getRandomValue(5, 200),
          getRandomValue(5, 200),
          getRandomValue(5, 200),
        ],
      },
    ]);
  };

  const handleAxisLengthChange = (event) => {
    setAxisLength(event.target.value);
  };

  return (
    <>
      <button onClick={dropSphere}>Drop Sphere</button>
      <div
        className="relative bg-black flex justify-center items-center"
        style={{ height: "70vh", width: "80vw" }}
      >
        <Canvas dpr={[1, 2]} shadows camera={{ position: [-5, 5, 5], fov: 50 }}>
          <Scene
            points={points}
            squares={squares}
            cubes={cubes}
            handleResetCamera={handleResetCamera}
            axisLength={axisLength}
            setDragging={setDragging} // Pass the setter function
          />
          <Sky
            sunPosition={new Vector3(100, 10, 100)}
            azimuth={0.25}
            distance={450000}
          />
          <Physics>
            <Plane />
            <DragCube setDragging={setDragging} />{" "}
            {/* Pass the setter function */}
            {cubes.map((cubeFaces, index) => (
              <Cube key={index} cubeFaces={cubeFaces} />
            ))}
            {spheres.map((sphere, index) => (
              <Sphere key={index} position={sphere.position} />
            ))}
          </Physics>
        </Canvas>
        <div className="absolute top-3 left-3 drop-filter backdrop-blur-lg rounded-sm">
          <button
            className="mb-3 text-gray-200"
            onClick={() => handleResetCamera.current()}
          >
            Reset Camera ⬅️
          </button>
          <input
            type="range"
            min="5"
            max="500"
            value={axisLength}
            onChange={handleAxisLengthChange}
            className="w-20"
          />
          <h1 className="text-cyan-200">TouchScreen Guide: </h1>
          <p className="text-cyan-100 text-sm">One finger to rotate</p>
          <p className="text-cyan-100 text-sm">Two fingers to move</p>
        </div>
      </div>
      <AddSquare addSquare={addSquare} />
      <AddCube addCube={addCube} /> {/* Add the new AddCube component */}
    </>
  );
};

const Square = ({ squarePoints }) => {
  return (
    <group>
      {/* Create lines for the square */}
      <Line points={squarePoints} color="white" lineWidth={5} />
      {/* Create points for the square corners */}
      <Points>
        {squarePoints.map((point, index) => (
          <PointsDot key={index} position={point} />
        ))}
      </Points>
    </group>
  );
};

const axisLabelStyle = {
  position: "absolute",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
};

const Lines = ({ axisLength }) => {
  let interval;
  if (axisLength <= 50) {
    interval = 5;
  } else if (axisLength <= 100) {
    interval = 10;
  } else if (axisLength <= 200) {
    interval = 20;
  } else if (axisLength <= 300) {
    interval = 30;
  } else if (axisLength <= 400) {
    interval = 40;
  } else if (axisLength <= 500) {
    interval = 50;
  } else {
    interval = 100;
  }

  const xAxisLabels = [];
  for (let i = 0; i <= axisLength; i += interval) {
    xAxisLabels.push(
      <Html position={new Vector3(i, 0, 0)} key={`x${i}`}>
        <div className="axis-label x-axis-label text-xs" style={axisLabelStyle}>
          {i}
        </div>
      </Html>
    );
  }

  const yAxisLabels = [];
  for (let i = 0; i <= axisLength; i += interval) {
    yAxisLabels.push(
      <Html position={new Vector3(0, i, 0)} key={`y${i}`}>
        <div className="axis-label y-axis-label text-xs" style={axisLabelStyle}>
          {i}
        </div>
      </Html>
    );
  }

  const zAxisLabels = [];
  for (let i = 0; i <= axisLength; i += interval) {
    zAxisLabels.push(
      <Html position={new Vector3(0, 0, i)} key={`z${i}`}>
        <div className="axis-label z-axis-label text-xs" style={axisLabelStyle}>
          {i}
        </div>
      </Html>
    );
  }

  return (
    <group>
      {/* X-axis line */}
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(axisLength, 0, 0)]}
        color="red"
        lineWidth={5}
      />
      <Dots points={[new Vector3(0, 0, 0), new Vector3(axisLength, 0, 0)]} />
      {xAxisLabels}
      <Html position={new Vector3(22, 2, 0)}>
        <div className="axis-label x-axis-label" style={axisLabelStyle}>
          X
        </div>
      </Html>

      {/* Y-axis line */}
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(0, axisLength, 0)]}
        color="green"
        lineWidth={5}
      />
      <Dots points={[new Vector3(0, 0, 0), new Vector3(0, axisLength, 0)]} />
      {yAxisLabels}
      <Html position={new Vector3(0, 22, 2)}>
        <div className="axis-label y-axis-label" style={axisLabelStyle}>
          Y
        </div>
      </Html>

      {/* Z-axis line */}
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(0, 0, axisLength)]}
        color="blue"
        lineWidth={5}
      />
      <Dots points={[new Vector3(0, 0, 0), new Vector3(0, 0, axisLength)]} />
      {zAxisLabels}
      <Html position={new Vector3(0, 2, 22)}>
        <div className="axis-label y-axis-label" style={axisLabelStyle}>
          Z
        </div>
      </Html>
    </group>
  );
};

const Dots = ({ points }) => {
  return (
    <Points>
      {points.map((point, index) => (
        <PointsDot key={index} position={point} />
      ))}
    </Points>
  );
};

const PointsDot = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />{" "}
      {/* Adjust the radius and segments */}
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

const Scene = ({
  points,
  squares,
  handleResetCamera,
  axisLength,
  setDragging,
}) => {
  const { camera } = useThree();
  const orbitControlsRef = useRef();
  const initialCameraPosition = useRef();

  useEffect(() => {
    // Set the initial position of the camera when the component mounts
    camera.position.z = 40;
    initialCameraPosition.current = camera.position.clone();
  }, [camera]);

  useEffect(() => {
    // Update the reset function to use the current camera and controls
    handleResetCamera.current = () => {
      if (orbitControlsRef.current) {
        // Reset the camera to its initial position
        camera.position.copy(initialCameraPosition.current);
        // Set the z value to 40 (how far the camera is away)
        camera.position.z = 40;
        camera.lookAt(new Vector3(0, 0, 0));
        orbitControlsRef.current.update();
      }
    };
  }, [camera, orbitControlsRef, handleResetCamera]);

  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <OrbitControls ref={orbitControlsRef} />
      <Lines axisLength={axisLength} />
      <Dots points={points} />
      {squares.map((squarePoints, index) => (
        <Square key={index} squarePoints={squarePoints} />
      ))}
    </>
  );
};

export default ThreeScene;
//-------------------------------------------------------------------------------------------------------------------
//3 lines

// import React, { useEffect } from "react";
// import * as THREE from "three";

// const ThreeScene = () => {
//   useEffect(() => {
//     // Set up Three.js components
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       1,
//       500
//     );
//     camera.position.set(0, 0, 100);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     // Use renderer.domElement directly
//     const container = document.getElementById("three-container");
//     container.appendChild(renderer.domElement);

//     // Create a LineBasicMaterial
//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

//     // Create lines in z, x, and y directions
//     const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, 0, 20), // Adjust the length in the z direction
//     ]);
//     const zLine = new THREE.Line(zLineGeometry, material);
//     scene.add(zLine);

//     const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(20, 0, 0), // Adjust the length in the x direction
//     ]);
//     const xLine = new THREE.Line(xLineGeometry, material);
//     scene.add(xLine);

//     const yLineGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, 20, 0), // Adjust the length in the y direction
//     ]);
//     const yLine = new THREE.Line(yLineGeometry, material);
//     scene.add(yLine);

//     // Animation function
//     const animate = () => {
//       requestAnimationFrame(animate);

//       // Rotate the lines (optional)
//       zLine.rotation.x += 0.01;
//       xLine.rotation.y += 0.01;
//       yLine.rotation.z += 0.01;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Resize event listener
//     const handleResize = () => {
//       const newWidth = window.innerWidth;
//       const newHeight = window.innerHeight;

//       camera.aspect = newWidth / newHeight;
//       camera.updateProjectionMatrix();

//       renderer.setSize(newWidth, newHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     // Clean up function for component unmount
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []); // Empty dependency array ensures useEffect runs only once on component mount

//   return (
//     <div id="three-container">
//       {/* You can add any additional content or UI elements here */}
//     </div>
//   );
// };

// export default ThreeScene;
//-------------------------------------------------------------------------------------------------------------------
//2 lines

// import React, { useEffect } from "react";
// import * as THREE from "three";

// const ThreeScene = () => {
//   useEffect(() => {
//     // Set up Three.js components
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       1,
//       500
//     );
//     camera.position.set(0, 0, 100);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     // Use renderer.domElement directly
//     const container = document.getElementById("three-container");
//     container.appendChild(renderer.domElement);

//     // Create a blue LineBasicMaterial
//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//     const points = [];
//     points.push(new THREE.Vector3(-10, 0, 0));
//     points.push(new THREE.Vector3(0, 10, 0));
//     points.push(new THREE.Vector3(10, 0, 0));

//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const line = new THREE.Line(geometry, material);
//     scene.add(line);

//     // Animation function
//     const animate = () => {
//       requestAnimationFrame(animate);

//       // Rotate the line (optional)
//       line.rotation.x += 0.01;
//       line.rotation.y += 0.01;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Resize event listener
//     const handleResize = () => {
//       const newWidth = window.innerWidth;
//       const newHeight = window.innerHeight;

//       camera.aspect = newWidth / newHeight;
//       camera.updateProjectionMatrix();

//       renderer.setSize(newWidth, newHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     // Clean up function for component unmount
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []); // Empty dependency array ensures useEffect runs only once on component mount

//   return (
//     <div id="three-container">
//       {/* You can add any additional content or UI elements here */}
//     </div>
//   );
// };

// export default ThreeScene;

//-------------------------------------------------------------------------------------------------------------------
//cube

// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Box } from "@react-three/drei";
// // import { LineBasicMaterial } from "three";

// const ThreeScene = () => {
//   return (
//     <Canvas style={{ height: "100vh", width: "100vw" }}>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//       <OrbitControls />
//       <Box>
//         <meshBasicMaterial
//           attach="material"
//           color="green"
//           wireframe={true} // Enable wireframe
//           wireframeLinewidth={4} // Adjust the thickness of the wireframe lines
//         />
//       </Box>
//     </Canvas>
//   );
// };

// export default ThreeScene;
