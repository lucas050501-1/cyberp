import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { User, PaginatedResponse } from '../types';
import { delay, shouldSimulateError, paginateArray } from './mock/mockUtils';
import { mockUsers } from './mock/mockData';

interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    if (USE_MOCK) {
      await delay(500);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al cargar usuarios');
      }

      let filteredUsers = [...mockUsers];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u =>
          u.email.toLowerCase().includes(searchLower) ||
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower)
        );
      }

      if (filters.role) {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }

      return paginateArray(filteredUsers, filters.page || 1, filters.limit || 10);
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return apiClient.get<PaginatedResponse<User>>(`${API_ENDPOINTS.USERS}?${params.toString()}`);
  }

  async updateUserRole(userId: string, role: User['role']): Promise<User> {
    if (USE_MOCK) {
      await delay(600);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al actualizar rol');
      }

      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      user.role = role;
      user.updatedAt = new Date().toISOString();
      
      return user;
    }

    return apiClient.put<User>(API_ENDPOINTS.USER_ROLE(userId), { role });
  }

  async deleteUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al eliminar usuario');
      }

      const index = mockUsers.findIndex(u => u.id === userId);
      if (index === -1) {
        throw new Error('Usuario no encontrado');
      }

      mockUsers.splice(index, 1);
      return;
    }

    return apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
  }
}

export const userService = new UserService();