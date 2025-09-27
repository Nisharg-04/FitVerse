import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

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

const SimpleGlobalAdvertisements: React.FC = () => {
  const location = useLocation();
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [displayType, setDisplayType] = useState<"banner" | "popup">("banner");

  // Don't show ads on login/register pages
  const excludeRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const shouldShowAds = !excludeRoutes.includes(location.pathname);

  // Function to fetch random advertisement
  const fetchRandomAd = async () => {
    try {
      console.log(
        "SimpleGlobalAdvertisements: Fetching random advertisement..."
      );
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/advertisement/getRandomAdvertisement`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log(
            "SimpleGlobalAdvertisements: Advertisement loaded:",
            result.data.title
          );
          setCurrentAd(result.data);
          return result.data;
        }
      }
    } catch (error) {
      console.error(
        "SimpleGlobalAdvertisements: Error fetching advertisement:",
        error
      );
    }
    return null;
  };

  // Load initial ad and set up intervals
  useEffect(() => {
    if (!shouldShowAds) return;

    let mounted = true;

    // Load first ad immediately
    const loadInitialAd = async () => {
      const ad = await fetchRandomAd();
      if (ad && mounted) {
        // Show banner after 2 seconds
        setTimeout(() => {
          if (mounted) {
            setShowBanner(true);
          }
        }, 2000);
      }
    };

    loadInitialAd();

    // Set up interval to fetch new ad and show it every 2 minutes
    const interval = setInterval(async () => {
      if (!mounted) return;

      const ad = await fetchRandomAd();
      if (ad && mounted) {
        // Hide current displays
        setShowBanner(false);
        setShowPopup(false);

        // Alternate between banner and popup
        setDisplayType((prev) => (prev === "banner" ? "popup" : "banner"));

        // Show the new ad after a short delay
        setTimeout(() => {
          if (mounted) {
            setDisplayType((currentType) => {
              if (currentType === "banner") {
                setShowBanner(true);
              } else {
                setShowPopup(true);
              }
              return currentType;
            });
          }
        }, 500);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [shouldShowAds, location.pathname]);

  // Reset states when route changes
  useEffect(() => {
    setShowBanner(false);
    setShowPopup(false);
  }, [location.pathname]);

  if (!shouldShowAds || !currentAd) {
    return null;
  }

  return (
    <>
      {/* Banner Ad */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-lg">
          <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-12 h-12 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-ad.png";
                }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {currentAd.title}
                </h4>
                <p className="text-sm text-gray-600">{currentAd.description}</p>
                <p className="text-xs text-gray-500">
                  by {currentAd.advertiserName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close advertisement"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Popup Ad */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-96 max-w-[90vw] overflow-hidden">
            <div className="relative">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                title="Close advertisement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                {currentAd.title}
              </h4>
              <p className="text-gray-600 mb-4">{currentAd.description}</p>
              <p className="text-sm text-gray-500">
                by {currentAd.advertiserName}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleGlobalAdvertisements;
