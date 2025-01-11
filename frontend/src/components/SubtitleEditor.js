import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

const SubtitleEditor = ({ subtitles, setSubtitles, onSubtitleClick, videoDimensions, currentTime, originalDimensions }) => {
  const { videoX, videoY, videoHeight, videoWidth } = videoDimensions;
  const { originalWidth, originalHeight } = originalDimensions;
  const subtitleEditorRef = useRef(null);

  const [subtitleSizes, setSubtitleSizes] = useState({});

  const addSubtitle = () => {
    setSubtitles([
      ...subtitles,
      { text: "New Subtitle", x: 100, y: 100, font: "Arial", size: 100, color: "black", start: currentTime, end: currentTime + 5 },
    ]);
  };

  const updateSubtitle = (index, key, value) => {
    const updated = [...subtitles];
    updated[index][key] = value;
    setSubtitles(updated);
  };

  const relativeToVideo = (x, y) => {
    const scalingFactorX = originalWidth / videoWidth;
    const scalingFactorY = originalHeight / videoHeight;
    const subtitleEditorPosition = getSubtitleEditorPosition();
    const globalX = subtitleEditorPosition.x + x;
    const globalY = subtitleEditorPosition.y + y + subtitleEditorPosition.height;
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
    const relativeY = globalY - subtitleEditorPosition.y - subtitleEditorPosition.height;

    const relativeFontSize = fontSize / Math.min(scalingFactorX, scalingFactorY);

    return { relativeX: relativeX, relativeY: relativeY, relativeFontSize };
  };

  const getSubtitleEditorPosition = () => {
    if (subtitleEditorRef.current) {
      const rect = subtitleEditorRef.current.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        height: rect.height,
      };
    }
    return { x: 0, y: 0, height: 0};
  };

   // This useEffect ensures we update subtitle sizes after the component has mounted or updated
   useEffect(() => {
    const updateSizes = () => {
      const newSizes = {};
      subtitles.forEach((_, index) => {
        const subtitleElement = document.getElementById(`subtitle-${index}`);
        if (subtitleElement) {
          const { width, height } = subtitleElement.getBoundingClientRect();
          console.log(width);
          console.log(height);
          newSizes[index] = { width, height };
        }
      });
      setSubtitleSizes(newSizes);
    };

    // Update subtitle sizes when subtitles change or component mounts
    updateSizes();
  }, [subtitles]);
  

  return (
    <div ref={subtitleEditorRef}>
      <button onClick={addSubtitle}>Add Subtitle</button>
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
              console.log(left);
              console.log(right);
              //console.log(data.y);
              updateSubtitle(index, "x", playerX);
              updateSubtitle(index, "y", playerY);
            }}
          >
            <div id={`subtitle-${index}`} onClick={() => onSubtitleClick(index)} style={{ position: "absolute", cursor: "move", zIndex: 1000 }}>
              <div
                style={{
                  fontSize: relativeFontSize,
                  color: subtitle.color,
                  fontFamily: subtitle.font,
                  background: "transparent",
                  border: "2px solid black",
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
    </div>
  );
};

export default SubtitleEditor;
