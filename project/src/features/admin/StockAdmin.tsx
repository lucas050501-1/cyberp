import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Package, Search } from 'lucide-react';
import { productService } from '../../services/products';
import { formatPrice } from '../../utils/format';
import { CATEGORIES } from '../../utils/constants';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';

export const StockAdmin: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: productsResponse,
    isLoading,
  } = useQuery({
    queryKey: ['stock-products', { search, category: selectedCategory }],
    queryFn: () => productService.getProducts({
      search: search || undefined,
      category: selectedCategory || undefined,
      page: 1,
      limit: 100,
    }),
  });

  const products = productsResponse?.data || [];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, label: 'Sin Stock', color: 'bg-red-100' };
    if (stock <= 5) return { variant: 'warning' as const, label: 'Stock Bajo', color: 'bg-yellow-100' };
    if (stock <= 10) return { variant: 'default' as const, label: 'Stock Medio', color: 'bg-blue-100' };
    return { variant: 'success' as const, label: 'Stock Alto', color: 'bg-green-100' };
  };

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Control de Inventario
        </h2>
        <p className="text-gray-600 mt-1">
          Monitorea el stock de todos los productos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {outOfStockProducts.length}
              </p>
              <p className="text-sm text-gray-600">Sin Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockProducts.length}
              </p>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {products.length}
              </p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                
                return (
                  <TableRow key={product.id} className={stockStatus.color}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold text-lg ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};