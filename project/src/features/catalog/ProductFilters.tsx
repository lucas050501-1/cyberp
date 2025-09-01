import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CATEGORIES } from '../../utils/constants';

interface ProductFiltersProps {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  onInStockChange: (inStock: boolean) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  category,
  minPrice,
  maxPrice,
  inStock,
  onSearchChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onClearFilters,
}) => {
  const hasActiveFilters = search || category || minPrice || maxPrice || inStock;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Category */}
        <Select
          placeholder="Todas las categorías"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={[
            { value: '', label: 'Todas las categorías' },
            ...CATEGORIES.map(cat => ({ value: cat, label: cat })),
          ]}
        />

        {/* Price Range */}
        <Input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          min="0"
        />

        <Input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          min="0"
        />

        {/* In Stock Filter */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="inStock" className="text-sm text-gray-700">
            Solo con stock
          </label>
        </div>
      </div>
    </div>
  );
};