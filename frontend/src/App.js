import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import SubtitleEditor from "./components/SubtitleEditor";
import SubtitleControls from "./components/SubtitleControls";
import axios from "axios";

//http://127.0.0.1:5000
//https://autocaption-4up6.onrender.com

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);
  const [subtitleTime, setSubtitleTime] = useState(0);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [processedVideoFile, setProcessedVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubtitleClick = (index) => {
    setSelectedSubtitleIndex(index);
  };

  const updateSelectedSubtitle = (key, value) => {
    if (selectedSubtitleIndex === null) return;
    const updated = [...subtitles];
    updated[selectedSubtitleIndex][key] = value;
    setSubtitles(updated);
    setSubtitleTime(subtitles[selectedSubtitleIndex].start);
  };

  // Handle Save Subtitles - Post request to save subtitles
  const handleSaveSubtitles = async () => {
    if (!videoFile || subtitles.length === 0) return;

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("subtitles", JSON.stringify(subtitles));

    setIsLoading(true);

    try {
      const response = await axios.post(`https://autocaption-4up6.onrender.com/save_subtitles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
  
      const videoUrl = URL.createObjectURL(response.data);
      setProcessedVideoFile(videoUrl);
    } catch (error) {
      console.error("Error processing subtitles:", error);
    } finally {
      setIsLoading(false);  // Set loading to false when the process ends (success or error)
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Subtitle Editor</h1>  {/* Title above everything */}

      <div className="main-content">
        <div className="left-side">
          <SubtitleEditor
            subtitles={subtitles}
            setSubtitles={setSubtitles}
            setSubtitleTime={setSubtitleTime}
            onSubtitleClick={handleSubtitleClick}
            videoDimensions={videoDimensions}
            currentTime={currentTime}
            originalDimensions={originalDimensions}
          />
          <SubtitleControls
            selectedSubtitle={subtitles[selectedSubtitleIndex]}
            updateSubtitle={updateSelectedSubtitle}
          />
          <button onClick={handleSaveSubtitles}>Save Subtitles</button>
          {isLoading ? (
            <div className="spinner"></div>
          ) : processedVideoFile && (
            <div>
              <a href={processedVideoFile} download={`${videoFileName.split(".")[0]}_processed.mp4`}>
                <button>Download Processed Video</button>
              </a>
            </div>
          )}
        </div>

        <div className="right-side">
          <VideoUploader
            setVideoDimensions={setVideoDimensions}
            setCurrentTime={setCurrentTime}
            setOriginalDimensions={setOriginalDimensions}
            setVideoFile={(file) => {
              setVideoFile(file); 
              setVideoFileName(file.name);
            }}
            subtitleTime={subtitleTime}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
