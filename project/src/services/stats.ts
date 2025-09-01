import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { StatsResponse } from '../types';
import { delay, shouldSimulateError } from './mock/mockUtils';
import { mockStats } from './mock/mockData';

class StatsService {
  async getSalesStats(): Promise<StatsResponse> {
    if (USE_MOCK) {
      await delay(700);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al cargar estadísticas');
      }

      return mockStats;
    }

    return apiClient.get<StatsResponse>(API_ENDPOINTS.SALES_STATS);
  }

  async getTopProducts(limit: number = 10): Promise<StatsResponse['topProducts']> {
    if (USE_MOCK) {
      await delay(500);
      return mockStats.topProducts.slice(0, limit);
    }

    return apiClient.get<StatsResponse['topProducts']>(`${API_ENDPOINTS.TOP_PRODUCTS}?limit=${limit}`);
  }
}

export const statsService = new StatsService();