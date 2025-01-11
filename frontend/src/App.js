import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import SubtitleEditor from "./components/SubtitleEditor";
import SubtitleControls from "./components/SubtitleControls";
import axios from "axios";

const App = () => {
  const [videoPath, setVideoPath] = useState(null); 
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [currentTime, setCurrentTime] = useState(0);

  const handleSubtitleClick = (index) => {
    setSelectedSubtitleIndex(index);
  };

  const updateSelectedSubtitle = (key, value) => {
    if (selectedSubtitleIndex === null) return;
    const updated = [...subtitles];
    updated[selectedSubtitleIndex][key] = value;
    setSubtitles(updated);
  };

  // Handle Save Subtitles - Post request to save subtitles
  const handleSaveSubtitles = async () => {
    if (!videoPath || subtitles.length === 0) return;

    try {
      const response = await axios.post("http://127.0.0.1:5000/save_subtitles", {
        videoPath,   // Video path to process
        subtitles,   // Subtitles data to apply
      });
      const processedVideoPath = response.data.outputPath;
      console.log("Processed video saved at:", processedVideoPath);
      // Here, you could provide a link to download the processed video or show it to the user.
    } catch (error) {
      console.error("Error processing subtitles:", error);
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center" }}>Interactive Subtitle Editor</h1>
        <VideoUploader
          onUpload={(file) => setVideoPath(file)}
          setVideoDimensions={setVideoDimensions}
          setCurrentTime={setCurrentTime}
          setOriginalDimensions={setOriginalDimensions}
        />
        <SubtitleEditor
          subtitles={subtitles}
          setSubtitles={setSubtitles}
          onSubtitleClick={handleSubtitleClick}
          videoDimensions={videoDimensions}
          currentTime={currentTime}
          originalDimensions={originalDimensions}
        />
      </div>
      <div>
        <SubtitleControls
          selectedSubtitle={subtitles[selectedSubtitleIndex]}
          updateSubtitle={updateSelectedSubtitle}
        />
      </div>
      <button onClick={handleSaveSubtitles}>Save Subtitles</button>
    </div>
  );
};

export default App;
