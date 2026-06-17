import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const host = window.location.hostname;
  return `http://${host}:8000/api/cards`;
};

const API_BASE_URL = getApiBaseUrl();
console.log("QRConnect using Backend API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const cardService = {
  createCard: async (formData) => {
    const response = await api.post('/create', formData);
    return response.data;
  },
  
  getCard: async (slug) => {
    // Normal JSON headers for get
    const response = await axios.get(`${API_BASE_URL}/${slug}`);
    return response.data;
  },
  
  getDashboardAnalytics: async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`);
    return response.data;
  },
  
  getDownloadUrl: (slug, type) => {
    // Return direct download URLs for assets
    return `${API_BASE_URL}/${slug}/${type}`;
  },
  
  deleteCard: async (slug) => {
    const response = await api.delete(`/${slug}/delete`);
    return response.data;
  }
};

export default api;
