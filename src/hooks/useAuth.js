import { create } from 'zustand';

export const useAuth = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    try {
      set({ isLoading: true });
      // Simulation d'une connexion réussie
      const user = { username: 'admin', role: 'admin' };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));