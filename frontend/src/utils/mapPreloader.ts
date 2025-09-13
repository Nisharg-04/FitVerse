// Map resource preloader utility
let leafletPreloaded = false;

export const preloadLeafletResources = (): Promise<void> => {
  if (leafletPreloaded) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    // Preload Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.onload = () => resolve();
      document.head.appendChild(cssLink);
    } else {
      resolve();
    }

    leafletPreloaded = true;
  });
};

// Preload map icons and assets
export const preloadMapAssets = () => {
  const imagesToPreload = [
    '/marker-icon.png',
    '/marker-icon-2x.png', 
    '/marker-shadow.png',
    '/profile-user.png',
    '/gymLogo.jpg'
  ];

  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};