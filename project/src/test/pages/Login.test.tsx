import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '../../features/auth/LoginPage';

// Mock the auth service
vi.mock('../../services/auth', () => ({
  authService: {
    login: vi.fn(),
  },
}));

// Mock the hooks
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    setUser: vi.fn(),
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

describe('LoginPage', () => {
  it('renders login form correctly', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email es requerido')).toBeInTheDocument();
      expect(screen.getByText('Contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Contraseña');
    const toggleButton = screen.getByLabelText('Mostrar contraseña');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});