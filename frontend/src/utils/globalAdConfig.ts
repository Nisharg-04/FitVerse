// Configuration presets for GlobalAdvertisements component

export interface GlobalAdvertisementConfig {
  enableBanner?: boolean;
  enablePopup?: boolean;
  enableFloating?: boolean;
  bannerPosition?: "top" | "bottom";
  popupDelay?: number;
  popupInterval?: number;
  floatingDelay?: number;
  excludeRoutes?: string[];
  displayDuration?: number;
}

export const defaultGlobalAdConfig: GlobalAdvertisementConfig = {
  enableBanner: true,
  enablePopup: true,
  enableFloating: false,
  bannerPosition: "top",
  popupDelay: 15000, // 15 seconds after page load
  popupInterval: 120000, // Show popup every 2 minutes
  floatingDelay: 30000, // 30 seconds after page load
  excludeRoutes: ["/login", "/register", "/forgot-password"], // No ads on auth pages
  displayDuration: 12000, // 12 seconds display time
};

// Configuration presets for different advertising strategies
export const GlobalAdvertisementPresets = {
  // Conservative settings for better user experience
  conservative: {
    enableBanner: true,
    enablePopup: true,
    enableFloating: false,
    popupDelay: 30000, // 30 seconds
    popupInterval: 180000, // 3 minutes
    displayDuration: 10000, // 10 seconds
    excludeRoutes: ["/login", "/register", "/forgot-password", "/reset-password"],
  },
  
  // Aggressive settings for maximum ad exposure
  aggressive: {
    enableBanner: true,
    enablePopup: true,
    enableFloating: true,
    popupDelay: 10000, // 10 seconds
    popupInterval: 60000, // 1 minute
    floatingDelay: 20000, // 20 seconds
    displayDuration: 15000, // 15 seconds
    excludeRoutes: ["/login", "/register"],
  },
  
  // Minimal settings for subtle advertising
  minimal: {
    enableBanner: true,
    enablePopup: false,
    enableFloating: false,
    displayDuration: 8000, // 8 seconds
    excludeRoutes: ["/login", "/register", "/forgot-password", "/reset-password", "/unauthorized"],
  },
} as const;