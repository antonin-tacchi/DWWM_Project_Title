import axios from 'axios';
import useNotificationStore from '../store/notificationStore';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      if (hadToken) {
        useNotificationStore.getState().add({
          type: 'error',
          title: 'Session expirée',
          message: 'Veuillez vous reconnecter.',
          duration: 4000,
        });
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
