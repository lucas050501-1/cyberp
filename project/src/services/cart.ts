import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS, CART_STORAGE_KEY } from '../utils/constants';
import { Cart, CartItem, Product } from '../types';
import { delay, shouldSimulateError, generateMockId } from './mock/mockUtils';
import { mockProducts } from './mock/mockData';

class CartService {
  private getMockCart(): Cart {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      id: generateMockId(),
      userId: 'mock_user',
      items: [],
      total: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  private saveMockCart(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  async getCart(): Promise<Cart> {
    if (USE_MOCK) {
      await delay(300);
      return this.getMockCart();
    }

    return apiClient.get<Cart>(API_ENDPOINTS.CART);
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    if (USE_MOCK) {
      await delay(400);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al agregar producto al carrito');
      }

      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (product.stock < quantity) {
        throw new Error('Stock insuficiente');
      }

      const cart = this.getMockCart();
      const existingItem = cart.items.find(item => item.productId === productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new Error('Stock insuficiente');
        }
        existingItem.quantity = newQuantity;
      } else {
        const newItem: CartItem = {
          id: generateMockId(),
          productId,
          product,
          quantity,
          price: product.price,
        };
        cart.items.push(newItem);
      }

      this.saveMockCart(cart);
      return cart;
    }

    return apiClient.post<Cart>(API_ENDPOINTS.CART, { productId, quantity });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    if (USE_MOCK) {
      await delay(300);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al actualizar carrito');
      }

      const cart = this.getMockCart();
      const item = cart.items.find(i => i.id === itemId);

      if (!item) {
        throw new Error('Item no encontrado');
      }

      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== itemId);
      } else {
        if (quantity > item.product.stock) {
          throw new Error('Stock insuficiente');
        }
        item.quantity = quantity;
      }

      this.saveMockCart(cart);
      return cart;
    }

    return apiClient.put<Cart>(`${API_ENDPOINTS.CART}/${itemId}`, { quantity });
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    if (USE_MOCK) {
      await delay(300);
      
      const cart = this.getMockCart();
      cart.items = cart.items.filter(item => item.id !== itemId);
      this.saveMockCart(cart);
      return cart;
    }

    return apiClient.delete<Cart>(`${API_ENDPOINTS.CART}/${itemId}`);
  }

  async clearCart(): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    return apiClient.delete<void>(API_ENDPOINTS.CART);
  }

  async checkStock(): Promise<{ valid: boolean; errors: string[] }> {
    if (USE_MOCK) {
      await delay(500);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al validar stock');
      }

      const cart = this.getMockCart();
      const errors: string[] = [];

      cart.items.forEach(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
          errors.push(`Stock insuficiente para ${item.product.name}`);
        }
      });

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    return apiClient.post<{ valid: boolean; errors: string[] }>(API_ENDPOINTS.CART_CHECK_STOCK);
  }
}

export const cartService = new CartService();