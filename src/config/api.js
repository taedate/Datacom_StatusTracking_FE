// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;
