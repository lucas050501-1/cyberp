import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Eye, Calendar, CreditCard } from 'lucide-react';
import { orderService } from '../../services/orders';
import { formatPrice, formatDateTime } from '../../utils/format';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const OrdersPage: React.FC = () => {
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(1, 20),
  });

  const orders = ordersResponse?.data || [];

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar pedidos</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mis Pedidos
        </h1>
        <p className="text-gray-600">
          Revisa el estado y detalles de tus pedidos
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No tienes pedidos aún
          </h2>
          <p className="text-gray-600 mb-8">
            Explora nuestro catálogo y realiza tu primera compra
          </p>
          <Link to="/catalog">
            <Button size="lg">
              <Package className="h-5 w-5 mr-2" />
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} hover>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {ORDER_STATUSES[order.status]}
                      </Badge>
                      <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                        {PAYMENT_STATUSES[order.paymentStatus]}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{order.paymentMethod === 'card' ? 'Tarjeta' : 
                               order.paymentMethod === 'transfer' ? 'Transferencia' : 'Contra Entrega'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} productos</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      Dirección: {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};