import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './features/admin/AdminLayout';

// Pages
import { HomePage } from './features/home/HomePage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { CatalogPage } from './features/catalog/CatalogPage';
import { ProductDetailPage } from './features/product/ProductDetailPage';
import { CartPage } from './features/cart/CartPage';
import { CheckoutPage } from './features/checkout/CheckoutPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { OrdersPage } from './features/orders/OrdersPage';
import { OrderDetailPage } from './features/orders/OrderDetailPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ProductsAdmin } from './features/admin/ProductsAdmin';
import { UsersAdmin } from './features/admin/UsersAdmin';
import { StockAdmin } from './features/admin/StockAdmin';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Auth Guard Component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};

// Unauthorized Page
const UnauthorizedPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta página
        </p>
        <button
          onClick={() => window.history.back()}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Volver
        </button>
      </div>
    </div>
  </Layout>
);

// NotFound Page
const NotFoundPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Página no encontrada</p>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Ir al Inicio
        </Link>
      </div>
    </div>
  </Layout>
);

export const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthGuard>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes - Authenticated Users */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Layout><CheckoutPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Layout><OrdersPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <Layout><OrderDetailPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Employee/Admin Only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Layout><AdminLayout><AdminDashboard /></AdminLayout></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Layout><AdminLayout><ProductsAdmin /></AdminLayout></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><AdminLayout><UsersAdmin /></AdminLayout></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stock"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Layout><AdminLayout><StockAdmin /></AdminLayout></Layout>
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthGuard>
      </Router>
    </QueryClientProvider>
  );
};