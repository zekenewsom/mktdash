// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  expires: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl || this.defaultTTL),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Get or fetch with caching
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return cached;

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

export const responseCache = new ResponseCache();
