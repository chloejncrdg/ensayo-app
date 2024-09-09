import { useLoader, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Bounds, Center, Resize } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE

const Tool = ({ modelPath }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  const ref = useRef();

  return (
    <Suspense fallback={null}>
      <Bounds fit clip observe margin={1.5} maxDuration={1} interpolateFunc={(t) => 1 - Math.exp(-5 * t) + 0.007 * t}>
        <Resize
          depth={true} // or height={true} or depth={true}, depending on your needs
          box3={ref.current ? new THREE.Box3().setFromObject(ref.current) : undefined}
        >
          <Center>
            <primitive object={gltf.scene} scale={1} position={[0, 0, 0]} ref={ref} />
          </Center>
        </Resize>
      </Bounds>
    </Suspense>
  );
};

export default Tool;
