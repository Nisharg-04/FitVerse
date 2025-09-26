// Centralized Advertisement Cache System
// Reduces API calls by caching and reusing advertisements

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

interface CachedAd extends Advertisement {
  fetchTime: number;
  usageCount: number;
}

class AdvertisementCache {
  private cache: CachedAd[] = [];
  private isLoading = false;
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MIN_FETCH_INTERVAL = 30 * 1000; // 30 seconds minimum between fetches
  private readonly MAX_CACHE_SIZE = 10;
  private readonly MAX_USAGE_COUNT = 3; // Max times an ad can be shown

  // Singleton pattern
  private static instance: AdvertisementCache;
  static getInstance(): AdvertisementCache {
    if (!AdvertisementCache.instance) {
      AdvertisementCache.instance = new AdvertisementCache();
    }
    return AdvertisementCache.instance;
  }

  // Get a random advertisement from cache or fetch if needed
  async getRandomAdvertisement(): Promise<Advertisement | null> {
    // Check if we have valid cached ads
    const validAds = this.getValidCachedAds();
    
    // If we have valid ads, return a random one
    if (validAds.length > 0) {
      const randomAd = this.selectRandomAd(validAds);
      this.incrementUsage(randomAd._id);
      return randomAd;
    }

    // If no valid ads and we haven't fetched recently, fetch new ones
    if (this.shouldFetchNew()) {
      const newAds = await this.fetchAdvertisements();
      if (newAds.length > 0) {
        const randomAd = this.selectRandomAd(newAds);
        this.incrementUsage(randomAd._id);
        return randomAd;
      }
    }

    return null;
  }

  // Get multiple advertisements at once (for components that need multiple ads)
  async getMultipleAdvertisements(count: number): Promise<Advertisement[]> {
    const validAds = this.getValidCachedAds();
    
    if (validAds.length >= count) {
      return this.selectMultipleAds(validAds, count);
    }

    // Fetch more ads if needed
    if (this.shouldFetchNew()) {
      await this.fetchAdvertisements();
      const updatedValidAds = this.getValidCachedAds();
      return this.selectMultipleAds(updatedValidAds, count);
    }

    return validAds.slice(0, count);
  }

  // Force refresh the cache (for user-initiated refresh)
  async forceRefresh(): Promise<Advertisement[]> {
    this.cache = []; // Clear cache
    return await this.fetchAdvertisements();
  }

  // Private methods
  private getValidCachedAds(): CachedAd[] {
    const now = Date.now();
    return this.cache.filter(ad => {
      const isNotExpired = now - ad.fetchTime < this.CACHE_DURATION;
      const isNotOverused = ad.usageCount < this.MAX_USAGE_COUNT;
      const isStillValid = new Date(ad.validUpto) > new Date();
      return isNotExpired && isNotOverused && isStillValid;
    });
  }

  private shouldFetchNew(): boolean {
    const now = Date.now();
    const timeSinceLastFetch = now - this.lastFetchTime;
    return !this.isLoading && timeSinceLastFetch > this.MIN_FETCH_INTERVAL;
  }

  private selectRandomAd(ads: CachedAd[]): CachedAd {
    // Prioritize ads with lower usage count
    const sortedAds = ads.sort((a, b) => a.usageCount - b.usageCount);
    const randomIndex = Math.floor(Math.random() * Math.min(ads.length, 3)); // Pick from top 3 least used
    return sortedAds[randomIndex];
  }

  private selectMultipleAds(ads: CachedAd[], count: number): CachedAd[] {
    const shuffled = [...ads].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private incrementUsage(adId: string): void {
    const ad = this.cache.find(ad => ad._id === adId);
    if (ad) {
      ad.usageCount++;
    }
  }

  private async fetchAdvertisements(): Promise<Advertisement[]> {
    if (this.isLoading) {
      return [];
    }

    this.isLoading = true;
    this.lastFetchTime = Date.now();

    try {
      // Fetch multiple ads in one API call instead of multiple individual calls
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/advertisement/getMultipleAdvertisements?limit=5`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        // Fallback to single random ad API if multiple ads endpoint doesn't exist
        const fallbackResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/advertisement/getRandomAdvertisement`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!fallbackResponse.ok) {
          throw new Error('Failed to fetch advertisements');
        }

        const fallbackResult = await fallbackResponse.json();
        if (fallbackResult.success && fallbackResult.data) {
          const newAd: CachedAd = {
            ...fallbackResult.data,
            fetchTime: Date.now(),
            usageCount: 0,
          };
          this.addToCache(newAd);
          return [newAd];
        }
        return [];
      }

      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data)) {
        const newAds: CachedAd[] = result.data.map((ad: Advertisement) => ({
          ...ad,
          fetchTime: Date.now(),
          usageCount: 0,
        }));

        // Add new ads to cache
        newAds.forEach(ad => this.addToCache(ad));
        return newAds;
      }

      return [];
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  private addToCache(ad: CachedAd): void {
    // Remove existing ad with same ID
    this.cache = this.cache.filter(cachedAd => cachedAd._id !== ad._id);
    
    // Add new ad
    this.cache.push(ad);
    
    // Limit cache size
    if (this.cache.length > this.MAX_CACHE_SIZE) {
      // Remove oldest ads
      this.cache.sort((a, b) => a.fetchTime - b.fetchTime);
      this.cache = this.cache.slice(-this.MAX_CACHE_SIZE);
    }
  }

  // Get cache statistics (for debugging)
  getCacheStats() {
    return {
      totalAds: this.cache.length,
      validAds: this.getValidCachedAds().length,
      isLoading: this.isLoading,
      lastFetchTime: this.lastFetchTime,
      cacheDetails: this.cache.map(ad => ({
        id: ad._id,
        title: ad.title,
        usageCount: ad.usageCount,
        age: Date.now() - ad.fetchTime,
      })),
    };
  }
}

// Export singleton instance
export const adCache = AdvertisementCache.getInstance();

// Hook for using the advertisement cache
export const useAdvertisementCache = () => {
  return {
    getRandomAd: () => adCache.getRandomAdvertisement(),
    getMultipleAds: (count: number) => adCache.getMultipleAdvertisements(count),
    forceRefresh: () => adCache.forceRefresh(),
    getCacheStats: () => adCache.getCacheStats(),
  };
};