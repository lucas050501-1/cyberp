import Cookies from 'js-cookie';
import { AUTH_STORAGE_KEY } from './constants';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
  // Also set as HTTP-only cookie for additional security
  Cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  Cookies.remove('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// JWT token parsing
export const parseJwtPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const payload = parseJwtPayload(token);
  return payload?.user || null;
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  return Date.now() >= payload.exp * 1000;
};