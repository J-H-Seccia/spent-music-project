import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import { Astronaut } from "./Astronaut";
import Stars from "./Stars";
import * as THREE from "three";
import { Box3 } from "three";

const BoundingBox = ({ visible }) => {
  const box = new THREE.Box3(
    new THREE.Vector3(-1.5, -1.5, -0.5), // Min point (reduced from -2)
    new THREE.Vector3(1.5, 1.5, 0.5) // Max point (reduced from 2)
  );

  return <box3Helper args={[box]} visible={visible} />;
};

export const Experience = ({ onSwitchScene }) => {
  const { camera, size } = useThree();
  const [isZooming, setIsZooming] = useState(false);
  const targetPosition = useRef(new THREE.Vector3(0, 0, -50));
  const originalPosition = useRef(new THREE.Vector3(0, 2, 5));
  const zoomProgress = useRef(0);
  const sceneRef = useRef();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(sceneRef.current);
    const boxSize = box.getSize(new THREE.Vector3());
    const boxCenter = box.getCenter(new THREE.Vector3());

    const fov = camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const dx = boxSize.x / (2 * Math.tan(fovh / 2));
    const dy = boxSize.y / (2 * Math.tan(fov / 2));
    const cameraZ = Math.max(dx, dy) * 0.14; // Reduced from 1.2 to zoom in slightly

    camera.position.set(0, boxCenter.y, boxCenter.z + cameraZ);
    camera.lookAt(boxCenter);
    camera.updateProjectionMatrix();

    originalPosition.current.copy(camera.position);
  }, [camera, size]);

  useFrame(() => {
    if (isZooming) {
      zoomProgress.current += 0.02; // Adjust for faster/slower zoom
      if (zoomProgress.current >= 1) {
        onSwitchScene();
      } else {
        camera.position.lerpVectors(
          originalPosition.current,
          targetPosition.current,
          zoomProgress.current
        );
      }
    }
  });

  const handleClick = () => {
    if (!isZooming) {
      setIsZooming(true);
      originalPosition.current.copy(camera.position);
    }
  };

  return (
    <group ref={sceneRef}>
      <directionalLight intensity={1} position={[0, 3, 2]} />
      <ambientLight intensity={0.2} />

      <Stars count={1000} />

      <group position-y={-1} onClick={handleClick}>
        <Astronaut />
      </group>

      <Environment preset="city" background={false} intensity={0.3} />

      <Text
        fontSize={0.4}
        font="fonts/Poppins-Black.ttf"
        position={[0, 0, -0.5]}
        onClick={handleClick}
      >
        SPENT
      </Text>
      <Text
        fontSize={0.4}
        font="fonts/Poppins-Black.ttf"
        position={[0, 0.5, -0.5]}
        onClick={handleClick}
      >
        enter the void
      </Text>

      <BoundingBox visible={false} />
    </group>
  );
};
