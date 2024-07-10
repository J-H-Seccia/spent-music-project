import React, { useState, useCallback, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Stars from "./Stars";
import AudioReactiveBlob from "./AudioReactiveBlob";

const BoundingBox = ({ visible }) => {
  const box = new THREE.Box3(
    new THREE.Vector3(-4, -4, -4),
    new THREE.Vector3(4, 4, 4)
  );

  return <box3Helper args={[box]} visible={visible} />;
};

const AdaptiveZoomingCamera = ({ sceneRef }) => {
  const { camera, size } = useThree();
  const startPosition = useRef(new THREE.Vector3(0, 0, 100));
  const targetPosition = useRef(new THREE.Vector3());
  const zoomProgress = useRef(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    const box = new THREE.Box3(
      new THREE.Vector3(-4, -4, -4),
      new THREE.Vector3(4, 4, 4)
    );
    const boxSize = box.getSize(new THREE.Vector3());
    const boxCenter = box.getCenter(new THREE.Vector3());

    const fov = camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const dx = boxSize.x / (2 * Math.tan(fovh / 2));
    const dy = boxSize.y / (2 * Math.tan(fov / 2));
    const cameraZ = Math.max(dx, dy) * 1.2;

    targetPosition.current.set(boxCenter.x, boxCenter.y, boxCenter.z + cameraZ);
    camera.position.copy(startPosition.current);
    zoomProgress.current = 0;
  }, [camera, size, sceneRef]);

  useFrame(() => {
    if (zoomProgress.current < 1) {
      zoomProgress.current += 0.01;
      camera.position.lerpVectors(
        startPosition.current,
        targetPosition.current,
        zoomProgress.current
      );
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

const ScalingStars = () => {
  const [scale, setScale] = useState(100);

  useFrame(() => {
    if (scale > 25) {
      setScale((prev) => prev - 1);
    }
  });

  return <Stars count={500} scale={scale} />;
};

const VisualizerScene = ({ audioData, isPlaying }) => {
  const sceneRef = useRef();

  return (
    <group ref={sceneRef}>
      <AdaptiveZoomingCamera sceneRef={sceneRef} />
      <ScalingStars />
      <AudioReactiveBlob audioData={audioData} isPlaying={isPlaying} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <BoundingBox visible={false} />
    </group>
  );
};

export default VisualizerScene;
