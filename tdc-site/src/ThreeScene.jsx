import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Points } from "@react-three/drei";
import { Vector3 } from "three";

const Scene = ({ points, handleResetCamera }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const initialCameraPosition = useRef();

  useEffect(() => {
    // Set the initial position of the camera when the component mounts
    camera.position.z = 40;
    initialCameraPosition.current = camera.position.clone();
  }, [camera]);

  useEffect(() => {
    // Update the reset function to use the current camera and controls
    handleResetCamera.current = () => {
      if (controlsRef.current) {
        // Reset the camera to its initial position
        camera.position.copy(initialCameraPosition.current);
        // Set the z value to 40 (how far the camera is away)
        camera.position.z = 40;
        camera.lookAt(new Vector3(0, 0, 0));
        controlsRef.current.update();
      }
    };
  }, [camera, controlsRef, handleResetCamera]);

  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <OrbitControls ref={controlsRef} />
      <Lines />
      <Dots points={points} />
    </>
  );
};

const ThreeScene = ({ points }) => {
  const handleResetCamera = useRef(() => {});

  return (
    <>
      <div
        className="relative bg-black flex justify-center"
        style={{ height: "70vh", width: "80vw" }}
      >
        <Canvas>
          <Scene points={points} handleResetCamera={handleResetCamera} />
        </Canvas>
        <div className="absolute top-3 left-3 drop-filter backdrop-blur-lg rounded-sm">
          <button
            className="mb-3 text-gray-200"
            onClick={() => handleResetCamera.current()}
          >
            Reset Camera ⬅
          </button>
          <h1 className="text-cyan-200">TouchScreen Guide: </h1>
          <p className="text-cyan-100 text-sm">One finger to rotate</p>
          <p className="text-cyan-100 text-sm">Two fingers to move</p>
        </div>
      </div>
    </>
  );
};

const Lines = () => {
  return (
    <group>
      {/* Z-axis line */}
      <Line points={[0, 0, 0, 0, 0, 20]} color="blue" lineWidth={5} />

      {/* X-axis line */}
      <Line points={[0, 0, 0, 20, 0, 0]} color="red" lineWidth={5} />

      {/* Y-axis line */}
      <Line points={[0, 0, 0, 0, 20, 0]} color="green" lineWidth={5} />
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
      <sphereGeometry args={[0.5, 32, 32]} />{" "}
      {/* Adjust the radius and segments */}
      <meshStandardMaterial color="yellow" />
    </mesh>
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
