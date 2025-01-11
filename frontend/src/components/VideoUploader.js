import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import CustomVideoPlayer from './CustomVideoPlayer';

const VideoUploader = ({ onUpload, setVideoDimensions, setCurrentTime, setOriginalDimensions }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setVideoFile(URL.createObjectURL(file));

    // Create a video element to get the video dimensions
    const videoElement = document.createElement("video");
    
    videoElement.src = URL.createObjectURL(file);
    videoElement.onloadedmetadata = () => {
      // Once the video metadata is loaded, get the dimensions
      const { videoWidth, videoHeight } = videoElement;
      console.log(videoWidth);
      console.log(videoHeight);

      // Pass the dimensions to the parent component
      setOriginalDimensions({ originalWidth: videoWidth, originalHeight: videoHeight });
    };

    // Upload video to backend
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const videoPath = response.data.path;
      onUpload(videoPath);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div>
      {!videoFile ? (
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
          videoFile={videoFile}
          setVideoDimensions={setVideoDimensions}
          setCurrentTime={setCurrentTime}
        />  // Use the custom player here
      )}

      {isUploading && <p>Uploading video... Please wait.</p>}
    </div>
  );
};

export default VideoUploader;
