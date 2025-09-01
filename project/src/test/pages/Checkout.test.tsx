import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckoutPage } from '../../features/checkout/CheckoutPage';

// Mock services and hooks
vi.mock('../../services/cart', () => ({
  cartService: {
    getCart: vi.fn().mockResolvedValue({
      id: '1',
      userId: '1',
      items: [
        {
          id: '1',
          productId: '1',
          product: {
            id: '1',
            name: 'Test Product',
            price: 50000,
            imageUrl: 'https://example.com/image.jpg',
          },
          quantity: 1,
          price: 50000,
        },
      ],
      total: 50000,
      updatedAt: new Date().toISOString(),
    }),
    checkStock: vi.fn(),
  },
}));

vi.mock('../../services/orders', () => ({
  orderService: {
    createOrder: vi.fn(),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    },
  }),
}));

vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    cart: {
      items: [
        {
          id: '1',
          product: { name: 'Test Product', imageUrl: 'https://example.com/image.jpg' },
          quantity: 1,
          price: 50000,
        },
      ],
      total: 50000,
    },
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

describe('CheckoutPage', () => {
  it('renders checkout form correctly', async () => {
    renderWithProviders(<CheckoutPage />);
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Información Personal')).toBeInTheDocument();
    expect(screen.getByText('Dirección de Entrega')).toBeInTheDocument();
    expect(screen.getByText('Método de Pago')).toBeInTheDocument();
    expect(screen.getByText('Tu Pedido')).toBeInTheDocument();
  });

  it('displays payment method options', () => {
    renderWithProviders(<CheckoutPage />);
    
    expect(screen.getByText('Tarjeta de Crédito/Débito')).toBeInTheDocument();
    expect(screen.getByText('Transferencia Bancaria')).toBeInTheDocument();
    expect(screen.getByText('Pago Contra Entrega')).toBeInTheDocument();
  });
});