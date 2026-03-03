import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds - backend can be slow
});

export default apiClient;
