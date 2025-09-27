import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Eye } from "lucide-react";
import { adCache } from "../utils/advertisementCache";
import {
  GlobalAdvertisementConfig,
  defaultGlobalAdConfig,
} from "../utils/globalAdConfig";

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

// Optimized Advertisement Display Component
const OptimizedAdDisplay: React.FC<{
  variant: "banner" | "popup" | "inline" | "sidebar";
  ad: Advertisement;
  onClose: () => void;
  className?: string;
}> = ({ variant, ad, onClose, className = "" }) => {
  const handleAdClick = () => {
    if (ad?.link) {
      window.open(ad.link, "_blank", "noopener,noreferrer");
    }
  };

  const renderBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-border/50 rounded-lg overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-ad.png";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">
              {ad.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {ad.description}
            </p>
            <p className="text-xs text-muted-foreground">
              by {ad.advertiserName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdClick}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
          >
            Visit
            <ExternalLink className="w-3 h-3 ml-1 inline" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Close ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPopup = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 right-4 z-50 w-80 bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-video w-full">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
          title="Close advertisement"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-foreground mb-2">{ad.title}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {ad.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            by {ad.advertiserName}
          </span>
          <button
            onClick={handleAdClick}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors flex items-center space-x-1"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {variant === "banner" && renderBanner()}
      {variant === "popup" && renderPopup()}
    </AnimatePresence>
  );
};

// Optimized Global Advertisement System
const OptimizedGlobalAdvertisements: React.FC<GlobalAdvertisementConfig> = (
  props
) => {
  const config = { ...defaultGlobalAdConfig, ...props };
  const location = useLocation();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentBannerAd, setCurrentBannerAd] = useState<Advertisement | null>(
    null
  );
  const [currentPopupAd, setCurrentPopupAd] = useState<Advertisement | null>(
    null
  );
  const [showBanner, setShowBanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [adRotationIndex, setAdRotationIndex] = useState(0);

  // Check if ads should be shown on current route
  const shouldShowAds = !config.excludeRoutes?.includes(location.pathname);

  // Load advertisements once when component mounts or route changes
  useEffect(() => {
    const loadAds = async () => {
      if (!shouldShowAds) {
        console.log("Ads disabled for this route:", location.pathname);
        return;
      }

      try {
        console.log("OptimizedGlobalAdvertisements: Loading advertisements...");

        // Try cache first
        const ads = await adCache.getMultipleAdvertisements(3);
        console.log(
          "OptimizedGlobalAdvertisements: Loaded ads from cache:",
          ads
        );

        if (ads.length > 0) {
          setAdvertisements(ads);
          setCurrentBannerAd(ads[0] || null);
          setCurrentPopupAd(ads[1] || ads[0] || null);
          console.log("OptimizedGlobalAdvertisements: Set current ads:", {
            banner: ads[0]?.title,
            popup: ads[1]?.title || ads[0]?.title,
          });
        } else {
          console.log(
            "OptimizedGlobalAdvertisements: No ads from cache, trying direct API call"
          );

          // Direct API call as fallback
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/advertisement/getRandomAdvertisement`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          console.log(
            "OptimizedGlobalAdvertisements: API response status:",
            response.status
          );

          if (response.ok) {
            const result = await response.json();
            console.log("OptimizedGlobalAdvertisements: API result:", result);

            if (result.success && result.data) {
              console.log(
                "OptimizedGlobalAdvertisements: Fallback ad loaded:",
                result.data
              );
              const adData = result.data;
              setAdvertisements([adData]);
              setCurrentBannerAd(adData);
              setCurrentPopupAd(adData);
            } else {
              console.log(
                "OptimizedGlobalAdvertisements: No advertisement data in response"
              );
            }
          } else {
            console.error(
              "OptimizedGlobalAdvertisements: API call failed with status:",
              response.status
            );
          }
        }
      } catch (error) {
        console.error(
          "OptimizedGlobalAdvertisements: Error loading advertisements:",
          error
        );
      }
    };

    loadAds();
  }, [location.pathname, shouldShowAds]);

  // Banner advertisement timing
  useEffect(() => {
    if (!currentBannerAd || !config.enableBanner) return;

    console.log("Setting up banner timer for ad:", currentBannerAd.title);
    const timer = setTimeout(() => {
      console.log("Showing banner ad");
      setShowBanner(true);
    }, 1000); // Show banner after 1 second

    return () => clearTimeout(timer);
  }, [currentBannerAd, config.enableBanner]);

  // Popup advertisement timing
  useEffect(() => {
    if (!currentPopupAd || !config.enablePopup) return;

    console.log("Setting up popup timer for ad:", currentPopupAd.title);

    const showPopupAd = () => {
      console.log("Showing popup ad");
      setShowPopup(true);

      // Hide popup after display duration
      setTimeout(() => {
        console.log("Hiding popup ad");
        setShowPopup(false);
        // Rotate to next ad if available
        if (advertisements.length > 1) {
          const nextIndex = (adRotationIndex + 1) % advertisements.length;
          setAdRotationIndex(nextIndex);
          setCurrentPopupAd(advertisements[nextIndex]);
        }
      }, config.displayDuration);
    };

    // Initial popup delay - much shorter for testing
    const popupTimer = setTimeout(() => {
      showPopupAd();
    }, 5000); // Show popup after 5 seconds instead of 30

    // Set up recurring popup interval if configured
    let intervalTimer: NodeJS.Timeout | undefined;
    if (config.popupInterval && config.popupInterval > 0) {
      intervalTimer = setInterval(showPopupAd, config.popupInterval);
    }

    return () => {
      clearTimeout(popupTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, [
    currentPopupAd,
    config.enablePopup,
    config.popupDelay,
    config.popupInterval,
    config.displayDuration,
    advertisements,
    adRotationIndex,
  ]);

  // Reset states when route changes
  useEffect(() => {
    setShowBanner(false);
    setShowPopup(false);
    setAdRotationIndex(0);
  }, [location.pathname]);

  if (!shouldShowAds) {
    console.log(
      "OptimizedGlobalAdvertisements: Ads disabled for route:",
      location.pathname
    );
    return null;
  }

  if (advertisements.length === 0) {
    console.log(
      "OptimizedGlobalAdvertisements: No advertisements available to display"
    );
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 p-2 rounded text-xs z-50">
        OptimizedGlobalAdvertisements: No ads loaded
      </div>
    );
  }

  return (
    <>
      {/* Debug Info */}
      <div className="fixed bottom-4 right-4 bg-blue-100 p-2 rounded text-xs z-40">
        <div>Route: {location.pathname}</div>
        <div>Should show ads: {shouldShowAds ? "YES" : "NO"}</div>
        <div>Ads loaded: {advertisements.length}</div>
        <div>Banner enabled: {config.enableBanner ? "YES" : "NO"}</div>
        <div>Banner ad: {currentBannerAd ? currentBannerAd.title : "None"}</div>
        <div>Show banner: {showBanner ? "YES" : "NO"}</div>
        <div>Popup enabled: {config.enablePopup ? "YES" : "NO"}</div>
        <div>Popup ad: {currentPopupAd ? currentPopupAd.title : "None"}</div>
        <div>Show popup: {showPopup ? "YES" : "NO"}</div>
      </div>

      {/* Banner Advertisement */}
      {config.enableBanner && currentBannerAd && showBanner && (
        <div
          className={`fixed left-0 right-0 z-40 ${
            config.bannerPosition === "top" ? "top-0" : "bottom-0"
          }`}
        >
          <OptimizedAdDisplay
            variant="banner"
            ad={currentBannerAd}
            onClose={() => setShowBanner(false)}
            className="shadow-lg mx-4 my-2"
          />
        </div>
      )}

      {/* Popup Advertisement */}
      {config.enablePopup && currentPopupAd && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <OptimizedAdDisplay
            variant="popup"
            ad={currentPopupAd}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </>
  );
};

export default OptimizedGlobalAdvertisements;
