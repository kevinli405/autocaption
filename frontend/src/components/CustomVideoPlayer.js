import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Slider } from '@mui/material';
import { FaPlay, FaPause } from 'react-icons/fa';
import './CustomVideoPlayer.css';

const CustomVideoPlayer = ({ videoFile, setVideoDimensions, setCurrentTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimePlayer] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = ({ playedSeconds }) => {
    setCurrentTimePlayer(playedSeconds);
    setCurrentTime(playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleReady = () => {
    // On component mount, pass the position of the player to parent
    if (setVideoDimensions && videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      const x = rect.left + window.scrollX;
      const y = rect.top + window.scrollY;
      const height = rect.height;
      const width = rect.width;

      // Pass the position to the parent
      setVideoDimensions({ videoX: x, videoY: y, videoHeight: height, videoWidth: width });
    }
  };

  return (
    <div className="video-player-container">
      <div ref={videoRef} className="video">
        <ReactPlayer
          ref={playerRef}
          url={videoFile}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onSeek={(seekTime) => setCurrentTime(seekTime)}
          progressInterval={100}
          width="100%"
          height="100%"
          controls={false}  // Disable default controls, we will create custom ones
        />
      </div>
      
      {/* Custom controls */}
      <div className="controls">
        {/* Play/Pause Button */}
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </IconButton>
        
        {/* Seek Bar */}
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          step={0.1}
          onChange={(e, newValue) => {
            setCurrentTime(newValue);
            playerRef.current.seekTo(newValue);
          }}
          aria-labelledby="continuous-slider"
        />
      </div>
    </div>
  );
};

export default CustomVideoPlayer;