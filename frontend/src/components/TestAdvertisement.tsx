import React, { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface Advertisement {
  _id: string;
  title: string;
  link: string;
  description: string;
  imageUrl: string;
  advertiserName: string;
  contactEmail: string;
  validUpto: string;
  viewId: string;
}

const TestAdvertisement: React.FC = () => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        console.log("Fetching test advertisement...");
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/advertisement/getRandomAdvertisement`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.success && result.data) {
          setAd(result.data);
          console.log("Advertisement loaded:", result.data);

          // Show banner after 2 seconds
          setTimeout(() => {
            console.log("Showing banner");
            setShowBanner(true);
          }, 2000);

          // Show popup after 5 seconds
          setTimeout(() => {
            console.log("Showing popup");
            setShowPopup(true);
          }, 5000);
        } else {
          setError("No advertisement data received");
        }
      } catch (err) {
        console.error("Error fetching advertisement:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 left-4 bg-blue-100 p-2 rounded">
        Loading advertisement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 left-4 bg-red-100 p-2 rounded text-red-800">
        Error: {error}
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="fixed top-4 left-4 bg-yellow-100 p-2 rounded text-yellow-800">
        No advertisements available
      </div>
    );
  }

  return (
    <>
      {/* Test Banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-4">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-ad.png";
                  }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{ad.title}</h4>
                  <p className="text-sm text-gray-600">{ad.description}</p>
                  <p className="text-xs text-gray-500">
                    by {ad.advertiserName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(ad.link, "_blank")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Visit <ExternalLink className="w-4 h-4 ml-1 inline" />
                </button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-2xl w-80 overflow-hidden">
            <div className="relative">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{ad.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  by {ad.advertiserName}
                </span>
                <button
                  onClick={() => window.open(ad.link, "_blank")}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Visit <ExternalLink className="w-3 h-3 ml-1 inline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="fixed bottom-4 left-4 bg-gray-100 p-2 rounded text-xs">
        <div>Ad loaded: {ad.title}</div>
        <div>Banner: {showBanner ? "Visible" : "Hidden"}</div>
        <div>Popup: {showPopup ? "Visible" : "Hidden"}</div>
      </div>
    </>
  );
};

export default TestAdvertisement;
