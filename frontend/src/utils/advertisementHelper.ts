// Utility functions for advertisement management

export interface AdConfig {
  enableAds?: boolean;
  variant?: "banner" | "popup" | "inline" | "sidebar";
  autoShow?: boolean;
  delay?: number;
  displayDuration?: number;
  className?: string;
}

export const defaultAdConfig: AdConfig = {
  enableAds: true,
  variant: "banner",
  autoShow: true,
  delay: 5000,
  displayDuration: 15000,
  className: "",
};

export const mergeAdConfig = (config1: AdConfig, config2: AdConfig): AdConfig => {
  return {
    ...defaultAdConfig,
    ...config1,
    ...config2,
  };
};

export const shouldShowAd = (config: AdConfig): boolean => {
  return config.enableAds !== false;
};