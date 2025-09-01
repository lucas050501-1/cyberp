import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { AuthResponse, User } from '../types';
import { setAuthToken, removeAuthToken } from '../utils/auth';
import { delay, shouldSimulateError, generateMockId } from './mock/mockUtils';
import { mockUsers } from './mock/mockData';

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(800);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error de conexión. Intenta nuevamente.');
      }

      // Simulate different login scenarios
      const user = mockUsers.find(u => u.email === email);
      if (!user || password !== 'password123') {
        throw new Error('Credenciales inválidas');
      }

      const mockToken = `mock_token_${generateMockId()}`;
      return { user, token: mockToken };
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    setAuthToken(response.token);
    return response;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(1000);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error de registro. Intenta nuevamente.');
      }

      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      const newUser: User = {
        id: generateMockId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = `mock_token_${generateMockId()}`;
      return { user: newUser, token: mockToken };
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);
    setAuthToken(response.token);
    return response;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    if (USE_MOCK) {
      await delay(1200);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al enviar email. Intenta nuevamente.');
      }

      return {
        message: 'Se ha enviado un enlace de recuperación a tu email',
      };
    }

    return apiClient.post<{ message: string }>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      removeAuthToken();
      return;
    }

    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      removeAuthToken();
    }
  }
}

export const authService = new AuthService();