import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { Order, PaginatedResponse, Address } from '../types';
import { delay, shouldSimulateError, generateMockId, paginateArray } from './mock/mockUtils';
import { mockOrders } from './mock/mockData';
import { cartService } from './cart';

interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  paymentMethod: 'card' | 'transfer' | 'cash_on_delivery';
}

class OrderService {
  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    if (USE_MOCK) {
      await delay(1500);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al procesar la orden');
      }

      // Simulate payment processing
      const paymentSuccess = Math.random() > 0.1; // 90% success rate
      if (!paymentSuccess && checkoutData.paymentMethod === 'card') {
        throw new Error('Pago rechazado. Verifica los datos de tu tarjeta.');
      }

      const cart = await cartService.getCart();
      
      const newOrder: Order = {
        id: generateMockId(),
        userId: 'mock_user',
        items: cart.items,
        total: cart.total,
        status: 'pending',
        paymentMethod: checkoutData.paymentMethod,
        paymentStatus: checkoutData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
        shippingAddress: checkoutData.shippingAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockOrders.unshift(newOrder);
      await cartService.clearCart();
      
      return newOrder;
    }

    return apiClient.post<Order>(API_ENDPOINTS.ORDERS, checkoutData);
  }

  async getMyOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK) {
      await delay(500);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al cargar pedidos');
      }

      return paginateArray(mockOrders, page, limit);
    }

    return apiClient.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.MY_ORDERS}?page=${page}&limit=${limit}`);
  }

  async getOrder(id: string): Promise<Order> {
    if (USE_MOCK) {
      await delay(400);
      
      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        throw new Error('Pedido no encontrado');
      }

      return order;
    }

    return apiClient.get<Order>(API_ENDPOINTS.ORDER_DETAIL(id));
  }

  async getAllOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK) {
      await delay(600);
      return paginateArray(mockOrders, page, limit);
    }

    return apiClient.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS}?page=${page}&limit=${limit}`);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    if (USE_MOCK) {
      await delay(500);
      
      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        throw new Error('Pedido no encontrado');
      }

      order.status = status;
      order.updatedAt = new Date().toISOString();
      
      return order;
    }

    return apiClient.put<Order>(API_ENDPOINTS.ORDER_DETAIL(id), { status });
  }
}

export const orderService = new OrderService();