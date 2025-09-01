import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  isAddingToCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAddingToCart,
}) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card hover className="group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 space-y-1">
          {isOutOfStock && (
            <Badge variant="error" size="sm">Sin Stock</Badge>
          )}
          {isLowStock && (
            <Badge variant="warning" size="sm">Pocas Unidades</Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/product/${product.id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalle
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {product.description.length > 80 
              ? `${product.description.slice(0, 80)}...`
              : product.description
            }
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>
          
          <Button
            size="sm"
            onClick={() => onAddToCart(product.id)}
            loading={isAddingToCart}
            disabled={isOutOfStock}
            className="min-w-0"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};