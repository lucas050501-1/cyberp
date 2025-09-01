import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { productService } from '../../services/products';
import { cartService } from '../../services/cart';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../components/ui/Toast';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProductCard } from '../catalog/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const { setCart, getItemQuantity } = useCart();
  const { showSuccess, showError } = useToast();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  const {
    data: recommendations = [],
  } = useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => productService.getRecommendations(id!),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      cartService.addToCart(productId, quantity),
    onSuccess: (cart) => {
      setCart(cart);
      showSuccess('Producto agregado al carrito');
    },
    onError: (error) => {
      showError(error.message || 'Error al agregar producto');
    },
    onSettled: () => {
      setAddingToCartId(null);
    },
  });

  const handleAddToCart = (productId: string, qty?: number) => {
    setAddingToCartId(productId);
    addToCartMutation.mutate({ productId, quantity: qty || quantity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el producto</p>
          <Button onClick={() => navigate('/catalog')}>
            Volver al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  const currentQuantityInCart = getItemQuantity(product.id);
  const maxQuantity = product.stock - currentQuantityInCart;
  const isOutOfStock = maxQuantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/catalog')}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver al Catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            {product.stock === 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="error">Sin Stock</Badge>
              </div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute top-4 left-4">
                <Badge variant="warning">Pocas Unidades</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="primary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Stock disponible: {product.stock} unidades
                </p>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {currentQuantityInCart > 0 && (
                  <span className="text-sm text-gray-500">
                    ({currentQuantityInCart} en carrito)
                  </span>
                )}
              </div>

              <Button
                onClick={() => handleAddToCart(product.id)}
                loading={addingToCartId === product.id}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                Producto agotado
              </p>
              <p className="text-red-600 text-sm mt-1">
                Te notificaremos cuando vuelva a estar disponible
              </p>
            </div>
          )}

          {/* Product Features */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900">¿Por qué elegir nuestras flores?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-700">Calidad Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Envío Rápido</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Garantía de Frescura</span>
              </div>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Cuidados Recomendados
            </h3>
            <ul className="text-sm text-emerald-800 space-y-2">
              <li>• Cambiar el agua cada 2-3 días</li>
              <li>• Cortar los tallos en diagonal bajo agua corriente</li>
              <li>• Mantener alejado de la luz solar directa</li>
              <li>• Remover hojas que toquen el agua</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAddingToCart={addingToCartId === product.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};