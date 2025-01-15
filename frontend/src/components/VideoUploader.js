import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import CustomVideoPlayer from './CustomVideoPlayer';

const VideoUploader = ({ setVideoDimensions, setCurrentTime, setOriginalDimensions, setVideoFile }) => {
  const [videoFileURL, setVideoFileURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setVideoFileURL(URL.createObjectURL(file));

    // Create a video element to get the video dimensions
    const videoElement = document.createElement("video");
    
    videoElement.src = URL.createObjectURL(file);
    videoElement.onloadedmetadata = () => {
      // Once the video metadata is loaded, get the dimensions
      const { videoWidth, videoHeight } = videoElement;

      // Pass the dimensions to the parent component
      setOriginalDimensions({ originalWidth: videoWidth, originalHeight: videoHeight });
    };

    setVideoFile(file);
  };


  return (
    <div>
      {!videoFileURL ? (
        <Dropzone onDrop={handleDrop} accept="video/*" multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", cursor: "pointer" }}>
              <input {...getInputProps()} />
              <p>Drag & drop a video, or click to select one</p>
            </div>
          )}
        </Dropzone>
      ) : (
        <CustomVideoPlayer 
          videoFile={videoFileURL}
          setVideoDimensions={setVideoDimensions}
          setCurrentTime={setCurrentTime}
        />  // Use the custom player here
      )}

      {isUploading && <p>Uploading video... Please wait.</p>}
    </div>
  );
};

export default VideoUploader;
