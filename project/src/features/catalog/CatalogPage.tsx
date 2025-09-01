import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productService } from '../../services/products';
import { cartService } from '../../services/cart';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../components/ui/Toast';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const { setCart } = useCart();
  const { showSuccess, showError } = useToast();

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock: inStock || undefined,
    page,
    limit: 12,
  }), [search, category, minPrice, maxPrice, inStock, page]);

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.addToCart(productId, 1),
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

  const handleAddToCart = (productId: string) => {
    setAddingToCartId(productId);
    addToCartMutation.mutate(productId);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  };

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Catálogo de Flores
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra amplia selección de flores frescas y arreglos únicos 
          para cada ocasión especial.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFilters
          search={search}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          inStock={inStock}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onInStockChange={setInStock}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error al cargar productos</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            No se encontraron productos que coincidan con tus filtros
          </p>
          <Button onClick={clearFilters}>
            Limpiar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isAddingToCart={addingToCartId === product.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <span className="text-sm text-gray-600">
            Página {page} de {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};