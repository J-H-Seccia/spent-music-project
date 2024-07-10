import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const getAverageFrequency = (
  dataArray,
  startIndex,
  endIndex,
  compressionFactor
) => {
  const slice = dataArray.slice(startIndex, endIndex + 1);
  const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
  const max = 255; // Maximum value in the frequency data
  let scaledValue = average / max; // Normalize to 0-1

  // Adjust for logarithmic compression
  scaledValue = Math.pow(scaledValue, compressionFactor);

  return scaledValue;
};

const AudioPlayer = ({ onAudioData, onPlayingChange }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekValue, setSeekValue] = useState(0);

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current && audioRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = "./songs/dune-remix.mp3";

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setSeekValue((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const updateFrequencyData = () => {
      if (analyserRef.current && isPlaying) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const bassFrequency = getAverageFrequency(dataArray, 0, 3, 25);
        const midFrequency = getAverageFrequency(dataArray, 4, 20, 5);
        const highFrequency = getAverageFrequency(dataArray, 21, 50, 4);

        onAudioData({ bassFrequency, midFrequency, highFrequency });
      }
      animationFrameId = requestAnimationFrame(updateFrequencyData);
    };

    if (isPlaying) {
      updateFrequencyData();
    } else {
      cancelAnimationFrame(animationFrameId);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, onAudioData]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      initializeAudio();
      audio.play();
    }
    setIsPlaying(!isPlaying);
    onPlayingChange(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "60px", // Adjust this value to leave space for the icons
        left: "50%",
        transform: "translateX(-50%)",
        width: "40%", // Use percentage width
        maxWidth: "500px",
        minWidth: "150px", // Set a minimum width
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "10px",
        display: "flex",
        flexDirection: "column", // Stack elements vertically on small screens
        alignItems: "center",
        justifyContent: "space-between",
      }}
      >
          <h3
        style={{
          color: "white",
          marginBottom: "15px",
          fontSize: "16px",
          fontWeight: "normal",
          textAlign: "center",
        }}
      >
        DUNE (S P E N T Remix)
      </h3>
      <audio ref={audioRef} />
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <button
          onClick={handlePlayPause}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <span style={{ color: "white", fontSize: "14px" }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={isNaN(seekValue) ? 0 : seekValue}
        onChange={handleSeek}
        style={{
          width: "100%",
          accentColor: "#4CAF50",
        }}
      />
    </div>
  );
};

export default AudioPlayer;
