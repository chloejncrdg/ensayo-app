import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState, useEffect } from "react";

import Tool from "../components/Tool";

const HitTester = ({ selectedTool }) => {
  const reticleRef = useRef();
  const [toolPosition, setToolPosition] = useState(null);
  const { isPresenting } = useXR();

  useEffect(() => {
    // console.log(selectedTool.name)
    if (!isPresenting) {
      setToolPosition(null);
    }
  }, [isPresenting, selectedTool]);

  useHitTest((hitMatrix, hit) => {
    if (reticleRef.current && hit) {
      // Update the reticle position based on the hit test result
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      );
      reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
    }
  });

  const placeTool = () => {
    if (reticleRef.current) {
      const position = reticleRef.current.position.clone();
      setToolPosition(position);
    }
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />

      {/* Render selected tool in AR mode */}
      {isPresenting && selectedTool && (
        <Interactive onSelect={placeTool}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color={'black'} />
          </mesh>
        </Interactive>
      )}

      {/* Render the tool in AR mode above the reticle when it is placed */}
      {isPresenting && selectedTool && toolPosition && (
        <Tool
          modelPath={`${selectedTool.modelPath}`}
          position={toolPosition.clone()} // Adjust the Y position to place above the reticle
          scale={0.25}
          adjustCamera={false}
        />
      )}

      {/* Render selected tool outside of AR mode */}
      {!isPresenting && selectedTool && (
        <Tool
          modelPath={`${selectedTool.modelPath}`}
          position={toolPosition}
          scale={1.3}
          adjustCamera={true}
        />
      )}
    </>
  );
};

export default HitTester;
