import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/cards';

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
