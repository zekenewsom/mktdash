import axios, { AxiosRequestConfig } from 'axios';

const DEFAULT_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 8000);
const DEFAULT_RETRIES = Number(process.env.PROVIDER_HTTP_RETRIES || 2);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getWithRetry<T = any>(url: string, config: AxiosRequestConfig = {}, retries = DEFAULT_RETRIES) {
  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await axios.get<T>(url, {
        timeout: DEFAULT_TIMEOUT_MS,
        ...config,
      });
    } catch (err: any) {
      lastError = err;
      if (attempt >= retries) break;
      const backoffMs = 250 * (attempt + 1);
      await sleep(backoffMs);
    }
  }

  throw lastError;
}
