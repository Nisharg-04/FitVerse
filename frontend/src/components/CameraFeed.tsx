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
  // useState to store saved images gallery
  const [savedImages, setSavedImages] = useState([]);
  // useState to track loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  // useState to track available cameras
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  // Function to enumerate available cameras
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);

      // Prioritize camera 0 (usually the best back camera)
      if (videoDevices.length > 0) {
        // First try to use camera 0 (index 0)
        const camera0 = videoDevices[0];
        setSelectedCameraId(camera0.deviceId);
        console.log("Selected Camera 0:", camera0.label || "Unknown Camera");
        return;
      }

      // Fallback: Try to find back/rear camera if camera 0 doesn't exist
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear")
      );
      if (backCamera) {
        setSelectedCameraId(backCamera.deviceId);
        console.log(
          "Selected back camera:",
          backCamera.label || "Unknown Camera"
        );
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

  // Function to save image to server
  const saveImageToServer = async (imageDataUrl) => {
    try {
      setIsSaving(true);
      setError(""); // Clear previous errors

      console.log("Attempting to save image to server...");
      console.log("Image data length:", imageDataUrl.length);

      const response = await fetch("http://localhost:8000/api/image/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageDataUrl,
          fileName: `fitness-photo-${Date.now()}.jpg`,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Server response:", result);

      if (result.success) {
        console.log("Image saved successfully:", result.data.imageUrl);
        // Refresh gallery
        loadSavedImages();
        return result.data;
      } else {
        throw new Error(result.message || "Failed to save image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      setError(`Failed to save image to server: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Function to load saved images from server
  const loadSavedImages = async () => {
    try {
      setIsLoadingGallery(true);
      const response = await fetch("http://localhost:8000/api/image/gallery");
      const result = await response.json();

      if (result.success) {
        setSavedImages(result.data);
      } else {
        console.error("Failed to load images:", result.message);
      }
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  // Function to delete image from server
  const deleteImageFromServer = async (fileName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/image/delete/${fileName}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Refresh gallery
        loadSavedImages();
        console.log("Image deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image");
    }
  };
  // Function to capture image from video stream
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Set for local preview
    setCapturedImage(imageDataUrl);

    // Save to server
    await saveImageToServer(imageDataUrl);
  };

  // Function to download captured image
  const downloadImage = () => {
    if (!capturedImage) return;

    const link = document.createElement("a");
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
    // Load saved images gallery
    loadSavedImages();

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
          <label
            htmlFor="camera-select"
            className="block text-sm font-medium mb-2"
          >
            Select Camera:
          </label>
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
          <h3 className="text-lg font-semibold mb-3">Latest Captured Photo:</h3>
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
              🗑️ Clear Preview
            </button>
          </div>
          {isSaving && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving to gallery...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Gallery */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Fitness Photo Gallery</h3>
          <button
            onClick={loadSavedImages}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm"
            disabled={isLoadingGallery}
          >
            {isLoadingGallery ? "🔄" : "🔄"} Refresh
          </button>
        </div>

        {isLoadingGallery ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        ) : savedImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedImages.map((image) => (
              <div key={image.fileName} className="relative group">
                <img
                  src={`http://localhost:8000${image.imageUrl}`}
                  alt={`Fitness photo ${image.fileName}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:8000${image.imageUrl}`,
                          "_blank"
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-sm"
                      title="View Full Size"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => deleteImageFromServer(image.fileName)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-sm"
                      title="Delete Image"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {new Date(image.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">📸</p>
            <p>No photos in gallery yet.</p>
            <p className="text-sm">Capture your first fitness photo above!</p>
          </div>
        )}
      </div>

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
