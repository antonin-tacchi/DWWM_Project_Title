import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Extrait le claim `role` depuis un JWT sans vérification de signature. */
function extractRoleFromToken(token) {
  if (!token) return 'user';
  try {
    return JSON.parse(atob(token.split('.')[1]))?.role ?? 'user';
  } catch {
    return 'user';
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        localStorage.setItem('token', token);
        // Toujours lire le rôle depuis le JWT pour éviter les sessions périmées
        const role = extractRoleFromToken(token);
        set({ token, user: { ...user, role }, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateUser: (user) => {
        // Conserver le rôle du token lors d'une mise à jour de profil
        const role = extractRoleFromToken(get().token);
        set({ user: { ...user, role } });
      },
    }),
    {
      name: 'clap-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      // À la réhydratation, corriger le rôle depuis le token stocké
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          const role = extractRoleFromToken(state.token);
          state.user = { ...state.user, role };
        }
      },
    }
  )
);

export default useAuthStore;
