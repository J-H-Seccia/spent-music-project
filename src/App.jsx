import React, { useState, useCallback, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import VisualizerScene from "./components/VisualizerScene";
import AudioPlayer from "./components/AudioPlayer";
import SocialMediaIcons from "./components/SocialMediaIcons";

function App() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [audioData, setAudioData] = useState({
    bassFrequency: 0,
    midFrequency: 0,
    highFrequency: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSwitchScene = useCallback(() => {
    console.log("Switching to VisualizerScene");
    setShowVisualizer(true);
  }, []);

  const handleAudioData = useCallback((data) => {
    setAudioData(data);
  }, []);

  const handlePlayingChange = useCallback((playing) => {
    setIsPlaying(playing);
  }, []);

  useEffect(() => {
    document.title = "SPENT";
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 30 }}
        style={{ width: "100vw", height: "100vh", background: "black" }}
      >
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          {!showVisualizer ? (
            <Experience onSwitchScene={handleSwitchScene} />
          ) : (
            <VisualizerScene audioData={audioData} isPlaying={isPlaying} />
          )}
        </Suspense>
      </Canvas>
      {showVisualizer && (
        <>
          <SocialMediaIcons
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              bottom: 80,
              pointerEvents: "none",
            }}
          />
          <AudioPlayer
            onAudioData={handleAudioData}
            onPlayingChange={handlePlayingChange}
          />
        </>
      )}
    </>
  );
}

export default App;
