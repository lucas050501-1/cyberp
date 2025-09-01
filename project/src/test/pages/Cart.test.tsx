import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartPage } from '../../features/cart/CartPage';

// Mock services and hooks
vi.mock('../../services/cart', () => ({
  cartService: {
    getCart: vi.fn().mockResolvedValue({
      id: '1',
      userId: '1',
      items: [],
      total: 0,
      updatedAt: new Date().toISOString(),
    }),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '1', firstName: 'Test' },
  }),
}));

vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    cart: null,
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

describe('CartPage', () => {
  it('renders empty cart message', async () => {
    renderWithProviders(<CartPage />);
    
    await screen.findByText('Tu carrito está vacío');
    expect(screen.getByText('Descubre nuestras hermosas flores y agrega algunas a tu carrito')).toBeInTheDocument();
    expect(screen.getByText('Explorar Catálogo')).toBeInTheDocument();
  });
});