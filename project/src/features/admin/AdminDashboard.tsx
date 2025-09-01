import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { statsService } from '../../services/stats';
import { formatPrice } from '../../utils/format';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: statsService.getSalesStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar estadísticas</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ventas Totales',
      value: formatPrice(stats.totalSales),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Pedidos Totales',
      value: stats.totalOrders.toString(),
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Productos Top',
      value: stats.topProducts.length.toString(),
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Clientes Activos',
      value: '156', // Mock data
      icon: Users,
      color: 'text-pink-600 bg-pink-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Ventas por Mes
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number) => [formatPrice(value), 'Ventas']}
                />
                <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Productos Más Vendidos
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-600">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.totalSold} vendidos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 text-sm">
                      {formatPrice(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};