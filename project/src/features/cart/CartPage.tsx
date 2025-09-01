import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { cartService } from '../../services/cart';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, setCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const {
    data: cartData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    onSuccess: setCart,
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      showSuccess('Carrito actualizado');
    },
    onError: (error) => {
      showError(error.message || 'Error al actualizar carrito');
    },
    onSettled: () => {
      setUpdatingItemId(null);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      showSuccess('Producto eliminado del carrito');
    },
    onError: (error) => {
      showError(error.message || 'Error al eliminar producto');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      setCart(null);
      showSuccess('Carrito vaciado');
      setShowClearConfirm(false);
    },
    onError: (error) => {
      showError(error.message || 'Error al vaciar carrito');
    },
  });

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setUpdatingItemId(itemId);
    updateCartMutation.mutate({ itemId, quantity: newQuantity });
  };

  const removeItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Descubre nuestras hermosas flores y agrega algunas a tu carrito
          </p>
          <Link to="/catalog">
            <Button size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Carrito de Compras
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClearConfirm(true)}
          disabled={clearCartMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Vaciar Carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.product.category}
                  </p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItemId === item.id}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-center min-w-[3rem]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || updatingItemId === item.id}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={removeItemMutation.isPending}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Stock Warning */}
              {item.quantity > item.product.stock && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Solo quedan {item.product.stock} unidades disponibles
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen del Pedido
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({items.length} productos)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span className="text-emerald-600">Gratis</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              onClick={proceedToCheckout}
              className="w-full mb-4"
              size="lg"
            >
              Proceder al Checkout
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Link to="/catalog">
              <Button variant="outline" className="w-full">
                Continuar Comprando
              </Button>
            </Link>

            {/* Trust Indicators */}
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Compra 100% segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                <span>Envío gratis en toda la ciudad</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-emerald-600" />
                <span>Garantía de frescura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Confirmar Acción"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas vaciar tu carrito? Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={clearCart}
              loading={clearCartMutation.isPending}
            >
              Sí, Vaciar Carrito
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};