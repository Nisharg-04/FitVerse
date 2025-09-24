import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  RotateCcw,
  Zap,
  TrendingUp,
  Target,
  Apple,
} from "lucide-react";

const FitnessCameraFeed = ({
  isOpen,
  onClose,
  scanningFor = "food",
  onSubmit,
}) => {
  // useRef to get references to video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // useState to store the media stream object
  const [stream, setStream] = useState(null);
  // useState to handle any errors
  const [error, setError] = useState("");
  // useState to store captured images
  const [capturedImage, setCapturedImage] = useState(null);
  // useState to track loading states
  const [isSaving, setIsSaving] = useState(false);
  // useState to track available cameras
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // useState for nutrition form data
  const [nutritionFormData, setNutritionFormData] = useState({
    consumptionTime: new Date().toISOString().split("T")[0],
    mealType: "Lunch",
    photos: null,
  });
  // useState for nutrition analysis results
  const [nutritionResults, setNutritionResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

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
  const startCamera = useCallback(async () => {
    setError("");
    try {
      const constraints = {
        audio: false,
        video: {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          facingMode: selectedCameraId ? undefined : "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError("Camera permission denied. Please allow camera access.");
      } else {
        setError("Could not access camera. Please ensure it's not in use.");
      }
    }
  }, [selectedCameraId]);

  // Function to stop the camera feed
  const stopCamera = useCallback(() => {
    if (stream) {
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

  // Function to send nutrition data to API
  const sendNutritionData = async (imageDataUrl) => {
    try {
      setIsSaving(true);
      setError("");

      // Convert base64 to blob first
      const base64Data = imageDataUrl.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Create FormData similar to register form
      const formDataToSend = new FormData();

      // Add photo as file
      const photoFile = new File([blob], `meal-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      formDataToSend.append("photos", photoFile);

      // Add other form data
      formDataToSend.append(
        "consumptionTime",
        nutritionFormData.consumptionTime
      );
      formDataToSend.append("mealType", nutritionFormData.mealType);

      console.log("Sending nutrition data...");
      console.log("Consumption Time:", nutritionFormData.consumptionTime);
      console.log("Meal Type:", nutritionFormData.mealType);

      const response = await fetch(
        "http://localhost:8000/api/nutrition/addNutrition",
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include", // Include cookies for session management
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("Nutrition data sent successfully:", result);
        return result.data;
      } else {
        throw new Error(result.message || "Failed to send nutrition data");
      }
    } catch (error) {
      console.error("Error sending nutrition data:", error);
      setError(`Failed to analyze nutrition: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Function to capture image from video stream
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageDataUrl);

    const nutritionData = await sendNutritionData(imageDataUrl);

    // Show results dialog if nutrition data was successfully retrieved
    if (nutritionData) {
      setNutritionResults(nutritionData);
      setShowResults(true);
    }

    // Call onSubmit callback if provided
    if (onSubmit && nutritionData) {
      onSubmit({
        imageData: imageDataUrl,
        nutritionData: nutritionData,
        consumptionTime: nutritionFormData.consumptionTime,
        mealType: nutritionFormData.mealType,
        timestamp: new Date().toISOString(),
        scanningFor,
      });
    }

    setTimeout(() => setIsProcessing(false), 1000); // Simulate processing delay
  };

  // Function to download captured image
  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `meal-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to close results dialog and reset for new capture
  const closeResultsDialog = () => {
    setShowResults(false);
    setNutritionResults(null);
    setCapturedImage(null);
    setNutritionFormData({
      consumptionTime: new Date().toISOString().split("T")[0],
      mealType: "Lunch",
      photos: null,
    });
    setError(""); // Clear any errors
    setIsProcessing(false); // Reset processing state

    // Ensure camera is active for next capture
    if (!stream && selectedCameraId) {
      startCamera();
    }
  };

  // Function to close entire camera modal and stop camera
  const closeCameraModal = () => {
    stopCamera();
    closeResultsDialog();
    onClose();
  };

  // Effect hook for initialization and cleanup
  useEffect(() => {
    if (isOpen) {
      getCameras();
    }

    return () => {
      stopCamera();
      clearImage();
    };
  }, [isOpen, stopCamera, clearImage]);

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen && selectedCameraId && !stream) {
      startCamera();
    }
  }, [isOpen, selectedCameraId, stream, startCamera]);

  // Effect to handle stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && closeCameraModal()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-green-500/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Apple className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  FitVerse Food Scanner
                </h2>
                <p className="text-green-100 text-sm">
                  AI-Powered Nutrition Analysis
                </p>
              </div>
            </div>
            <button
              onClick={closeCameraModal}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Close camera"
              aria-label="Close camera"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Camera Selection */}
            {cameras.length > 1 && (
              <div className="flex items-center justify-center">
                <label htmlFor="camera-select" className="sr-only">
                  Select camera device
                </label>
                <select
                  id="camera-select"
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!!stream}
                  title="Select camera device"
                  aria-label="Select camera device"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label ||
                        `Camera ${camera.deviceId.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nutrition Form Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="consumption-time"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Consumption Date
                </label>
                <input
                  id="consumption-time"
                  type="date"
                  value={nutritionFormData.consumptionTime}
                  onChange={(e) =>
                    setNutritionFormData((prev) => ({
                      ...prev,
                      consumptionTime: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="meal-type"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Meal Type
                </label>
                <select
                  id="meal-type"
                  value={nutritionFormData.mealType}
                  onChange={(e) =>
                    setNutritionFormData((prev) => ({
                      ...prev,
                      mealType: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  title="Select meal type"
                  aria-label="Select meal type"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid">
              {/* Camera Feed */}
              <div className="lg:col-span-2">
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 lg:h-80 object-cover"
                  />

                  {/* Camera Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Scanning Grid */}
                    <div className="absolute inset-4 border-2 border-green-400 rounded-lg opacity-50">
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="border border-green-400/30" />
                        ))}
                      </div>
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-green-400" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-green-400" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-green-400" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-green-400" />

                    {/* Status Indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>Ready to Scan</span>
                      </div>
                    </div>
                  </div>

                  {/* Capture Button */}
                  {stream && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                      <button
                        onClick={captureImage}
                        disabled={isProcessing}
                        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center border-4 border-white/20 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-8 w-8 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      {/* Nutrition Results Dialog */}
      {showResults && nutritionResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={closeCameraModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Apple className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Nutrition Added Successfully!
                </h3>
              </div>
              <button
                onClick={closeCameraModal}
                className="text-gray-400 hover:text-white p-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4 mb-4">
              <p className="text-green-300 text-sm">
                Your meal has been successfully analyzed and added to your
                nutrition log.
              </p>
            </div>

            {/* Nutrition Results */}
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Meal Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Type:</span>{" "}
                    {nutritionFormData.mealType}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Date:</span>{" "}
                    {nutritionFormData.consumptionTime}
                  </p>
                </div>
              </div>

              {/* Display API Response Data */}
              {nutritionResults && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="text-white font-medium mb-2">
                    Analysis Results
                  </h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    {typeof nutritionResults === "object" ? (
                      Object.entries(nutritionResults).map(([key, value]) => (
                        <p key={key}>
                          <span className="text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      ))
                    ) : (
                      <p>{nutritionResults}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeResultsDialog}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Scan Another Meal
              </button>
              <button
                onClick={closeCameraModal}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FitnessCameraFeed;
