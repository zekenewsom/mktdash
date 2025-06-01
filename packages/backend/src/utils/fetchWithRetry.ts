import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Fetches a URL with retry/backoff on 429 and network errors.
 * @param url The URL to fetch
 * @param config Axios config
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in ms for backoff
 * @returns AxiosResponse
 */
export async function fetchWithRetry<T = any>(
  url: string,
  config: AxiosRequestConfig = {},
  maxRetries = 3,
  initialDelay = 500
): Promise<AxiosResponse<T>> {
  let attempt = 0;
  let delay = initialDelay;
  while (true) {
    try {
      return await axios.get<T>(url, config);
    } catch (err: any) {
      const status = err.response?.status;
      const isRateLimit = status === 429;
      const isNetwork = !err.response;
      if ((isRateLimit || isNetwork) && attempt < maxRetries) {
        attempt++;
        const jitter = Math.floor(Math.random() * 100);
        const wait = delay + jitter;
        console.warn(`[fetchWithRetry] Attempt ${attempt} failed for ${url} (status: ${status || 'network'}). Retrying in ${wait}ms...`);
        await new Promise(res => setTimeout(res, wait));
        delay *= 2; // Exponential backoff
        continue;
      }
      // Log and rethrow final error
      console.error(`[fetchWithRetry] Failed after ${attempt} attempts for ${url}:`, err.message);
      throw err;
    }
  }
}
