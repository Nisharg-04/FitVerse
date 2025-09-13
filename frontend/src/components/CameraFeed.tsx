import React, { useState, useRef, useEffect } from "react";

const CameraFeed = () => {
  // useRef to get a reference to the video element
  const videoRef = useRef(null);
  // useState to store the media stream object
  const [stream, setStream] = useState(null);
  // useState to handle any errors
  const [error, setError] = useState("");

  // Function to start the camera feed
  const startCamera = async () => {
    setError(""); // Reset any previous errors
    try {
      // Define constraints for the media stream (we want video)
      const constraints = {
        audio: false, // We don't need audio
        video: {
          facingMode: "environment", // 'user' for front camera, 'environment' for back camera
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
  const stopCamera = () => {
    if (stream) {
      // Loop through all tracks in the stream and stop them
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Effect hook for cleanup
  // This will run when the component unmounts
  useEffect(() => {
    // Return a cleanup function
    return () => {
      stopCamera(); // Stop the camera when the component is removed
    };
  }, [stream]); // Dependency array includes stream to re-run if stream changes

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Mobile Camera Access in PWA</h2>
      {/* Display the video feed */}
      {/* The 'playsInline' and 'autoPlay' properties are important for mobile */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Muting is often required for autoplay to work
        style={{ width: "100%", maxWidth: "500px", border: "1px solid #ccc" }}
      />

      {/* Display control buttons */}
      <div style={{ marginTop: "10px" }}>
        {!stream ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
      </div>

      {/* Display any error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CameraFeed;  
