import React, { useState, useRef, useEffect, useCallback } from "react";

const CameraFeed = () => {
  // useRef to get references to video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // useState to store the media stream object
  const [stream, setStream] = useState(null);
  // useState to handle any errors
  const [error, setError] = useState("");
  // useState to store captured images
  const [capturedImage, setCapturedImage] = useState(null);
  // useState to track available cameras
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  // Function to enumerate available cameras
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      
      // Try to find the main camera (usually not ultrawide)
      // Main cameras typically have "back" or "rear" in their label and are not "wide" or "ultra"
      const mainCamera = videoDevices.find(device => {
        const label = device.label.toLowerCase();
        return label.includes('back') || label.includes('rear') && 
               !label.includes('wide') && !label.includes('ultra');
      });
      
      // If main camera found, use it; otherwise use the first back camera
      if (mainCamera) {
        setSelectedCameraId(mainCamera.deviceId);
      } else {
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        if (backCamera) {
          setSelectedCameraId(backCamera.deviceId);
        }
      }
    } catch (err) {
      console.error("Error enumerating cameras:", err);
    }
  };

  // Function to start the camera feed
  const startCamera = async () => {
    setError(""); // Reset any previous errors
    try {
      // Define constraints for the media stream
      const constraints = {
        audio: false, // We don't need audio
        video: {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          facingMode: selectedCameraId ? undefined : "environment", // Fallback to environment
          width: { ideal: 1920 }, // High resolution for better quality
          height: { ideal: 1080 },
        },
      };

      // Request access to the camera
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      // If we have a video element ref, set its srcObject to the stream
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      // Store the stream in state
      setStream(newStream);
    } catch (err) {
      // Handle errors
      console.error("Error accessing camera:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Camera permission was denied. Please allow camera access in your browser settings."
        );
      } else {
        setError(
          "Could not access the camera. Please ensure it's not in use by another app."
        );
      }
    }
  };

  // Function to stop the camera feed
  const stopCamera = useCallback(() => {
    if (stream) {
      // Loop through all tracks in the stream and stop them
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Function to clear captured image
  const clearImage = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
  }, [capturedImage]);

  // Function to capture image from video stream
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create image URL
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
      }
    }, 'image/jpeg', 0.9); // High quality JPEG
  };

  // Function to download captured image
  const downloadImage = () => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `fitness-photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effect hook for initialization and cleanup
  useEffect(() => {
    // Get available cameras when component mounts
    getCameras();
    
    // Return a cleanup function
    return () => {
      stopCamera(); // Stop the camera when the component is removed
      clearImage(); // Clean up any captured images
    };
  }, [stopCamera, clearImage]); // Include dependencies

  // Effect to handle stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="p-5 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">FitVerse Camera</h2>
      
      {/* Camera Selection */}
      {cameras.length > 1 && (
        <div className="mb-4">
          <label htmlFor="camera-select" className="block text-sm font-medium mb-2">Select Camera:</label>
          <select 
            id="camera-select"
            value={selectedCameraId} 
            onChange={(e) => setSelectedCameraId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!stream}
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId.substring(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Feed */}
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-lg border-2 border-gray-300 rounded-lg shadow-lg"
        />
        
        {/* Capture Button Overlay */}
        {stream && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={captureImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors duration-200 font-medium"
            >
              📸 Capture Photo
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center mb-4">
        {!stream ? (
          <button 
            onClick={startCamera}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            📹 Start Camera
          </button>
        ) : (
          <button 
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            ⏹️ Stop Camera
          </button>
        )}
      </div>

      {/* Captured Image Display */}
      {capturedImage && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Captured Photo:</h3>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="max-w-full h-auto border border-gray-300 rounded-lg shadow-md mx-auto mb-4"
          />
          <div className="flex gap-3 justify-center">
            <button
              onClick={downloadImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              💾 Download
            </button>
            <button
              onClick={clearImage}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;  
