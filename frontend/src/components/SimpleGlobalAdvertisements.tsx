import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Zap, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            // setShowPopup(true);
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
        }, 2000);
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
      {/* Notification Banner Ad - Top Right */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-24 right-6 z-40 max-w-sm"
          >
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-lg rounded-xl shadow-xl border border-primary/20 overflow-hidden hover:shadow-2xl transition-shadow">
              {/* Content Container */}
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <img
                        src={currentAd.imageUrl}
                        alt={currentAd.title}
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-ad.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                        <h4 className="font-bold text-white text-sm truncate">
                          {currentAd.title}
                        </h4>
                      </div>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {currentAd.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 text-white/80 hover:text-white"
                    title="Close advertisement"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Action Button
                <a
                  href={currentAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowBanner(false)}
                  className="block"
                >
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <span>Learn More</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </a> */}

                {/* Footer */}
                <p className="text-xs text-white/60 text-center">
                  Ad by {currentAd.advertiserName}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Ad - Full Screen Modal (unchanged) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-background to-background/95 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-primary/20"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={currentAd.imageUrl}
                  alt={currentAd.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Close Button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-background/90 text-foreground rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  title="Close advertisement"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    <h3 className="font-bold text-lg text-foreground">
                      {currentAd.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {currentAd.description}
                  </p>
                </div>

                {/* Action Button */}
                {/* <a
                  href={currentAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowPopup(false)}
                  className="block"
                >
                  <button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-opacity flex items-center justify-center gap-2">
                    <span>Explore Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </a> */}

                {/* Footer */}
                <p className="text-xs text-muted-foreground text-center border-t border-border/50 pt-3">
                  Advertisement by {currentAd.advertiserName}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleGlobalAdvertisements;
