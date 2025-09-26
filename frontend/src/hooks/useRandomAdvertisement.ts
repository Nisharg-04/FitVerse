import { useState, useEffect, useCallback } from "react";
import { adCache } from "../utils/advertisementCache";

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

interface UseRandomAdvertisementOptions {
  autoShow?: boolean;
  delay?: number;
  displayDuration?: number;
  refetchInterval?: number;
}

export const useRandomAdvertisement = (options: UseRandomAdvertisementOptions = {}) => {
  const {
    autoShow = true,
    delay = 0,
    displayDuration = 10000,
    refetchInterval = 0, // 0 means no refetch
  } = options;

  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomAd = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedAd = await adCache.getRandomAdvertisement();

      if (cachedAd) {
        setAd(cachedAd);
        return cachedAd;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching advertisement:", error);
      setError(error instanceof Error ? error.message : "Failed to load ad");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showAd = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideAd = useCallback(() => {
    setIsVisible(false);
  }, []);

  const refreshAd = useCallback(() => {
    fetchRandomAd();
  }, [fetchRandomAd]);

  // Initial fetch
  useEffect(() => {
    fetchRandomAd();
  }, [fetchRandomAd]);

  // Auto show with delay
  useEffect(() => {
    if (autoShow && ad && !error) {
      const timer = setTimeout(() => {
        showAd();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, ad, error, delay, showAd]);

  // Auto hide after duration
  useEffect(() => {
    if (isVisible && displayDuration > 0) {
      const timer = setTimeout(() => {
        hideAd();
      }, displayDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, displayDuration, hideAd]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchRandomAd();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchRandomAd]);

  return {
    ad,
    isVisible,
    isLoading,
    error,
    showAd,
    hideAd,
    refreshAd,
    fetchRandomAd,
  };
};

// Hook for managing multiple ads on a page
export const useMultipleAds = (count: number = 3) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMultipleAds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedAds: Advertisement[] = [];

      // Fetch multiple ads
      for (let i = 0; i < count; i++) {
        const response = await fetch(
          "http://localhost:8000/api/advertisement/getRandomAdvertisement",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Check if ad is still valid and not duplicate
            const validUpto = new Date(result.data.validUpto);
            if (
              validUpto > new Date() &&
              !fetchedAds.find((ad) => ad._id === result.data._id)
            ) {
              fetchedAds.push(result.data);
            }
          }
        }
      }

      setAds(fetchedAds);
    } catch (error) {
      console.error("Error fetching multiple advertisements:", error);
      setError(error instanceof Error ? error.message : "Failed to load ads");
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchMultipleAds();
  }, [fetchMultipleAds]);

  return {
    ads,
    isLoading,
    error,
    refreshAds: fetchMultipleAds,
  };
};

export default useRandomAdvertisement;