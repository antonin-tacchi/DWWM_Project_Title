import axios from 'axios';
import useNotificationStore from '../store/notificationStore';
import i18n from '../i18n';

/* TMDB locale map: i18n key → TMDB language code */
const TMDB_LOCALE = { fr: 'fr-FR', en: 'en-US' };

/* Endpoints that proxy TMDB and accept a ?language= param */
const TMDB_PREFIXES = ['/movies', '/actors', '/tv'];

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  /* Auth header */
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /* Inject TMDB language for movie/actor/tv endpoints */
  const url = config.url ?? '';
  const isTmdbRoute = TMDB_PREFIXES.some((prefix) => url.startsWith(prefix));
  if (isTmdbRoute) {
    const lang = i18n.language ?? 'fr';
    const tmdbLang = TMDB_LOCALE[lang] ?? 'fr-FR';

    config.params = { ...config.params };

    /* discover uses uiLanguage, every other route uses language */
    if (url.includes('/discover') && !url.includes('/discover/random')) {
      config.params.uiLanguage = tmdbLang;
    } else {
      config.params.language = tmdbLang;
    }
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
