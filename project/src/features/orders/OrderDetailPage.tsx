import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, Phone, Mail } from 'lucide-react';
import { orderService } from '../../services/orders';
import { formatPrice, formatDateTime } from '../../utils/format';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el pedido</p>
          <Button onClick={() => navigate('/orders')}>
            Volver a Mis Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'processing':
      case 'shipped':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Mis Pedidos
        </button>
      </div>

      {/* Order Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Pedido #{order.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600 mt-1">
                  Realizado el {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {ORDER_STATUSES[order.status]}
                </Badge>
                <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                  {PAYMENT_STATUSES[order.paymentStatus]}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Dirección de Entrega
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Información de Pago
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Método:</span>{' '}
                {order.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 
                 order.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'Pago Contra Entrega'}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{' '}
                <span className={`font-medium ${
                  order.paymentStatus === 'completed' ? 'text-green-600' :
                  order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {PAYMENT_STATUSES[order.paymentStatus]}
                </span>
              </p>
              <p>
                <span className="font-medium">Total:</span>{' '}
                <span className="text-lg font-bold text-emerald-600">
                  {formatPrice(order.total)}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Productos Pedidos
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.quantity}x {formatPrice(item.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total del Pedido
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Necesitas ayuda con tu pedido?
              </h3>
              <p className="text-gray-600 mb-4">
                Nuestro equipo está aquí para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <a
                  href="mailto:soporte@florashop.com"
                  className="flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>soporte@florashop.com</span>
                </a>
                <a
                  href="tel:+571234567"
                  className="flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>+57 1 234 5678</span>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};