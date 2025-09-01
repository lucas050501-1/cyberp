import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { productService } from '../../services/products';
import { useToast } from '../../components/ui/Toast';
import { formatPrice } from '../../utils/format';
import { CATEGORIES } from '../../utils/constants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { ProductFormModal } from './ProductFormModal';

export const ProductsAdmin: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const {
    data: productsResponse,
    isLoading,
  } = useQuery({
    queryKey: ['admin-products', { search, category: selectedCategory }],
    queryFn: () => productService.getProducts({
      search: search || undefined,
      category: selectedCategory || undefined,
      page: 1,
      limit: 100,
    }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      showSuccess('Producto eliminado exitosamente');
    },
    onError: (error) => {
      showError(error.message || 'Error al eliminar producto');
    },
  });

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    setShowProductForm(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const products = productsResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestión de Productos
        </h2>
        <Button
          onClick={() => setShowProductForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
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

          {(search || selectedCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
              }}
            >
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
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
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {product.description.slice(0, 50)}...
                        </p>
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
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'success' : 'error'}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showProductForm}
        onClose={handleFormClose}
        productId={editingProduct}
      />
    </div>
  );
};