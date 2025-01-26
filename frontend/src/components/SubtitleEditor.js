import './SubtitleEditor.css';

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

const SubtitleEditor = ({ subtitles, setSubtitles, setSubtitleTime, onSubtitleClick, videoDimensions, currentTime, originalDimensions }) => {
  const { videoX, videoY, videoHeight, videoWidth } = videoDimensions;
  const { originalWidth, originalHeight } = originalDimensions;
  const subtitleEditorRef = useRef(null);

  const [subtitleSizes, setSubtitleSizes] = useState({});
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);

  const addSubtitle = () => {
    if (!videoWidth || !videoHeight || !originalWidth || !originalHeight) {
      console.warn("Cannot add subtitle: No video loaded.");
      return; // Do nothing if video dimensions are not set
    }
    
    setSubtitles([
      ...subtitles,
      { text: "New Subtitle", x: 100, y: 100, font: "Arial", size: 100, color: "black", start: currentTime, end: currentTime + 5, index: subtitles.length },
    ]);
  };

  const updateSubtitle = (index, key, value) => {
    const updated = [...subtitles];
    updated[index][key] = value;
    setSubtitles(updated);
    setSubtitleTime(subtitles[index].start);
  };

  const relativeToVideo = (x, y) => {
    const scalingFactorX = originalWidth / videoWidth;
    const scalingFactorY = originalHeight / videoHeight;
    const subtitleEditorPosition = getSubtitleEditorPosition();
    const globalX = subtitleEditorPosition.x + x;
    const globalY = subtitleEditorPosition.y + y;
    const playerX = globalX - videoX;
    const playerY = globalY - videoY;

    return { playerX: playerX * scalingFactorX, playerY: playerY * scalingFactorY };
  };

  const videoToRelative = (x, y, fontSize) => {
    const scalingFactorX = originalWidth / videoWidth;
    const scalingFactorY = originalHeight / videoHeight;
    const subtitleEditorPosition = getSubtitleEditorPosition();
    const globalX = x / scalingFactorX + videoX;
    const globalY = y / scalingFactorY + videoY;
    const relativeX = globalX - subtitleEditorPosition.x;
    const relativeY = globalY - subtitleEditorPosition.y;

    const relativeFontSize = fontSize / Math.min(scalingFactorX, scalingFactorY);

    return { relativeX: relativeX, relativeY: relativeY, relativeFontSize };
  };

  const getSubtitleEditorPosition = () => {
    if (subtitleEditorRef.current) {
      const rect = subtitleEditorRef.current.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      };
    }
    return { x: 0, y: 0};
  };

  // This useEffect ensures we update subtitle sizes after the component has mounted or updated
  useEffect(() => {
    const updateSizes = () => {
      const newSizes = {};
      subtitles.forEach((_, index) => {
        const subtitleElement = document.getElementById(`subtitle-${index}`);
        if (subtitleElement) {
          const { width, height } = subtitleElement.getBoundingClientRect();
          newSizes[index] = { width, height };
        }
      });
      setSubtitleSizes(newSizes);
    };

    // Update subtitle sizes when subtitles change or component mounts
    updateSizes();
  }, [subtitles]);
  
  const handleSubtitleClick = (index) => {
    setSelectedSubtitleIndex(index);
    setSubtitleTime(subtitles[index].start);
    onSubtitleClick(index); // Update selected subtitle in the parent component if necessary
  };

  const handleSubtitleTextChange = (index, text) => {
    updateSubtitle(index, "text", text);
  };

  return (
    <div className="subtitle-editor" ref={subtitleEditorRef}>
      {subtitles.map((subtitle, index) => {
        const { relativeX, relativeY, relativeFontSize } = videoToRelative(subtitle.x, subtitle.y, subtitle.size);

        const { relativeX: left, relativeY: top } = videoToRelative(0, 0);
        const { relativeX: right, relativeY: bottom } = videoToRelative(originalWidth, originalHeight);

        // Get the size of the current subtitle for dynamic bounds
        const subtitleSize = subtitleSizes[index] || { width: 0, height: 0 };
        
        const bounds = {
          left: left,
          top: top,
          right: right - subtitleSize.width,
          bottom: bottom - subtitleSize.height,
        };

        if (currentTime < subtitle.start || currentTime > subtitle.end) {
          return null; // Don't render if the current time is outside the subtitle's range
        }

        return (
          <Draggable
            key={index}
            bounds={bounds}
            defaultPosition={{ x: relativeX, y: relativeY}}
            onStop={(e, data) => {
              const {playerX, playerY} = relativeToVideo(data.x, data.y);
              updateSubtitle(index, "x", playerX);
              updateSubtitle(index, "y", playerY);
            }}
          >
            <div
              id={`subtitle-${index}`}
              onClick={() => handleSubtitleClick(index)} 
              style={{ position: "absolute", cursor: "move", zIndex: 1000, border: selectedSubtitleIndex === index ? "2px solid black" : "none", }}>
              <div
                style={{
                  fontSize: relativeFontSize,
                  color: subtitle.color,
                  fontFamily: subtitle.font,
                  background: "transparent",
                  padding: "0",
                  outline: "none",
                  cursor: "text",
                }}
              >
                {subtitle.text}
              </div>
            </div>
          </Draggable>
        )
      })}

      <button style={{marginTop: "0"}} onClick={addSubtitle}>Add Subtitle</button>

      <div
        className="subtitle-list"
        style={{
          maxHeight: "30vh", // Set max height to 30% of the viewport height
          overflowY: "auto", // Make it scrollable
          marginTop: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc", // Optional, to visually separate the list
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 
          style={{marginTop: "10px", marginBottom: "10px"}}>
          Subtitles:
        </h3>
        <div>
          {subtitles.slice().sort((a, b) => a.start - b.start).map((subtitle) => (
            <div
              key={subtitle.index}
              onClick={() => handleSubtitleClick(subtitle.index)}
              className={`subtitle-list-item ${
                selectedSubtitleIndex === subtitle.index ? "selected" : ""
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px",
                marginBottom: "5px",
                borderRadius: "4px", // Optional: rounded corners
                border: "1px solid #ccc",
              }}
            >
              <input
                type="text"
                value={subtitle.text}
                onChange={(e) => handleSubtitleTextChange(subtitle.index, e.target.value)}
                style={{
                  flex: "1", // Allows the input to stretch as needed
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "0px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubtitleEditor;
