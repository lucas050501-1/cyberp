import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogPage } from '../../features/catalog/CatalogPage';

// Mock services
vi.mock('../../services/products', () => ({
  productService: {
    getProducts: vi.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 50000,
          category: 'Rosas',
          stock: 10,
          imageUrl: 'https://example.com/image.jpg',
          isActive: true,
        },
      ],
      pagination: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
      },
    }),
  },
}));

vi.mock('../../services/cart', () => ({
  cartService: {
    addToCart: vi.fn(),
  },
}));

vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    setCart: vi.fn(),
  }),
}));

vi.mock('../../components/ui/Toast', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CatalogPage', () => {
  it('renders catalog page correctly', async () => {
    renderWithProviders(<CatalogPage />);
    
    expect(screen.getByText('Catálogo de Flores')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
  });

  it('renders product filters', () => {
    renderWithProviders(<CatalogPage />);
    
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Precio mínimo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Precio máximo')).toBeInTheDocument();
    expect(screen.getByLabelText('Solo con stock')).toBeInTheDocument();
  });
});