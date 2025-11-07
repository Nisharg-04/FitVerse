import React, { useState } from "react";

export default function GymQrDisplay({ id }) {
  const [qrData, setQrData] = useState(null);
  const server = import.meta.env.VITE_BACKEND_URL;

  const fetchQr = async () => {
    const res = await fetch(`${server}/gym/qrcode/${id}`); // example gym ID
    const data = await res.json();
    console.log(data);
    setQrData(data.data.qrCodeImage);
  };

  const downloadQr = () => {
    const link = document.createElement("a");
    link.href = qrData;
    link.download = "FitVerse_Gym_QR.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        onClick={fetchQr}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Generate QR Code
      </button>

      {qrData && (
        <>
          <img
            src={qrData}
            alt="Gym QR Code"
            className="border rounded-xl shadow-md w-64 h-64"
          />
          <button
            onClick={downloadQr}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Download QR Code
          </button>
        </>
      )}
    </div>
  );
}
