import { create } from 'zustand';
import { User } from '../types';
import { getUserFromToken, isAuthenticated } from '../utils/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  checkAuth: () => {
    const authenticated = isAuthenticated();
    const user = authenticated ? getUserFromToken() : null;
    set({ user, isAuthenticated: authenticated });
  },
}));

// Hook for components
export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout, checkAuth } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    setUser,
    logout,
    checkAuth,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee' || user?.role === 'admin',
  };
};