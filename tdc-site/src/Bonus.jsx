import { MathUtils, Color } from "three";
import { useCallback, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { easing } from "maath";
import { Grid, useDrag } from "./Grid";

function Cube({
  position = [0.5, 0.5, -0.5],
  c = new Color(),
  round = Math.round,
  clamp = MathUtils.clamp,
  ...props
}) {
  const ref = useRef();
  const pos = useRef(position);
  const onDrag = useCallback(
    ({ x, z }) =>
      (pos.current = [
        round(clamp(x, -5, 4)) + 0.5,
        position[1],
        round(clamp(z, -5, 4)) + 0.5,
      ]),
    []
  );
  const [events, active, hovered] = useDrag(onDrag);
  useEffect(
    () =>
      void (document.body.style.cursor = active
        ? "grabbing"
        : hovered
        ? "grab"
        : "auto"),
    [active, hovered]
  );
  useFrame((state, delta) => {
    easing.damp3(ref.current.position, pos.current, 0.1, delta);
    easing.dampC(
      ref.current.material.color,
      active ? "white" : hovered ? "lightblue" : "orange",
      0.1,
      delta
    );
  });
  return (
    <mesh ref={ref} castShadow receiveShadow {...events} {...props}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function Bonus() {
  return (
    <Canvas shadows orthographic camera={{ position: [5, 5, 5], zoom: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, -5]} castShadow shadow-mapSize={1024} />
      <Grid scale={10}>
        <Cube position={[0.5, 1, -0.5]} scale={[1, 2, 1]} />
        <Cube position={[2 + 0.5, 0.5, 2 - 0.5]} />
        <Cube position={[-2 + 0.5, 1.5, 2 + 0.5]} scale={[1, 3, 1]} />
      </Grid>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
