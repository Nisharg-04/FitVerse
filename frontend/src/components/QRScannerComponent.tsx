import { useState, useCallback } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

export default function QRScannerComponent() {
  const [data, setData] = useState("Waiting for QR...");
  const [scanning, setScanning] = useState(true); // ✅ controls scanning state

  const handleScan = useCallback(async (result) => {
    if (!result) return;

    try {
      const parsed = JSON.parse(result.text);

      // ✅ Check if it's a valid FitVerse QR
      if (!parsed.gymId) {
        console.warn("Unrecognized QR — ignoring...");
        return;
      }

      const gymId = parsed.gymId;
      setData(`✅ Valid QR detected! Gym ID: ${gymId}`);
      console.log("Valid FitVerse QR scanned:", gymId);

      // ✅ Stop scanning once a valid QR is found
      setScanning(false);

      const server = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${server}/payment/accessGym`,
        { gymId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Check-in response:", response.data);
    } catch (err) {
      // Invalid JSON — ignore silently
      console.warn("Invalid QR format — skipping...");
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error("Camera error:", err);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <h2 className="text-xl font-semibold">Scan Gym QR Code</h2>

      {/* ✅ Only show scanner when scanning is true */}
      {scanning ? (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "300px" }}
        />
      ) : (
        <div className="text-green-600 font-medium">
          Scanning stopped — valid QR detected ✅
        </div>
      )}

      <p className="text-gray-700 mt-2">{data}</p>
    </div>
  );
}
