import { apiClient, USE_MOCK } from './ApiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { Product, PaginatedResponse } from '../types';
import { delay, shouldSimulateError, paginateArray } from './mock/mockUtils';
import { mockProducts } from './mock/mockData';

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    if (USE_MOCK) {
      await delay(600);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al cargar productos');
      }

      let filteredProducts = [...mockProducts];

      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(p => p.stock > 0);
      }

      return paginateArray(filteredProducts, filters.page || 1, filters.limit || 12);
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const endpoint = filters.search 
      ? `${API_ENDPOINTS.PRODUCT_SEARCH}?${params.toString()}`
      : `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`;

    return apiClient.get<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<Product> {
    if (USE_MOCK) {
      await delay(400);
      
      if (shouldSimulateError(0.03)) {
        throw new Error('Error al cargar producto');
      }

      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      return product;
    }

    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_DETAIL(id));
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (USE_MOCK) {
      await delay(800);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al crear producto');
      }

      const newProduct: Product = {
        ...productData,
        id: `mock_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockProducts.push(newProduct);
      return newProduct;
    }

    return apiClient.post<Product>(API_ENDPOINTS.PRODUCTS, productData);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    if (USE_MOCK) {
      await delay(700);
      
      if (shouldSimulateError(0.1)) {
        throw new Error('Error al actualizar producto');
      }

      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      mockProducts[index] = {
        ...mockProducts[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      return mockProducts[index];
    }

    return apiClient.put<Product>(API_ENDPOINTS.PRODUCT_DETAIL(id), productData);
  }

  async deleteProduct(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      
      if (shouldSimulateError(0.05)) {
        throw new Error('Error al eliminar producto');
      }

      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      mockProducts.splice(index, 1);
      return;
    }

    return apiClient.delete(API_ENDPOINTS.PRODUCT_DETAIL(id));
  }

  async getRecommendations(productId: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(400);
      
      const currentProduct = mockProducts.find(p => p.id === productId);
      if (!currentProduct) return [];

      // Return products from the same category
      return mockProducts
        .filter(p => p.id !== productId && p.category === currentProduct.category)
        .slice(0, 4);
    }

    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCT_DETAIL(productId)}/recommendations`);
  }
}

export const productService = new ProductService();