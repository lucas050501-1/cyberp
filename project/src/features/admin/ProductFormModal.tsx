import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/products';
import { useToast } from '../../components/ui/Toast';
import { productSchema } from '../../utils/validation';
import { CATEGORIES } from '../../utils/constants';
import { Product } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const isEdit = !!productId;
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      isActive: true,
    },
  });

  // Fetch product data for editing
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProduct(productId!),
    enabled: isEdit && !!productId,
  });

  // Set form values when editing
  useEffect(() => {
    if (product && isEdit) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('stock', product.stock);
      setValue('imageUrl', product.imageUrl);
      setValue('isActive', product.isActive);
    }
  }, [product, isEdit, setValue]);

  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      showSuccess('Producto creado exitosamente');
      onClose();
      reset();
    },
    onError: (error) => {
      showError(error.message || 'Error al crear producto');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      showSuccess('Producto actualizado exitosamente');
      onClose();
    },
    onError: (error) => {
      showError(error.message || 'Error al actualizar producto');
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (isEdit && productId) {
      updateProductMutation.mutate({ id: productId, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('name')}
            label="Nombre del Producto"
            placeholder="Ej: Rosas Rojas Premium"
            error={errors.name?.message}
          />
          
          <Select
            {...register('category')}
            label="Categoría"
            placeholder="Selecciona una categoría"
            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            error={errors.category?.message}
          />
        </div>

        <Input
          {...register('description')}
          label="Descripción"
          placeholder="Describe el producto..."
          error={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            label="Precio (COP)"
            placeholder="45000"
            min="0"
            step="1000"
            error={errors.price?.message}
          />
          
          <Input
            {...register('stock', { valueAsNumber: true })}
            type="number"
            label="Stock"
            placeholder="25"
            min="0"
            error={errors.stock?.message}
          />
        </div>

        <Input
          {...register('imageUrl')}
          type="url"
          label="URL de la Imagen"
          placeholder="https://ejemplo.com/imagen.jpg"
          error={errors.imageUrl?.message}
        />

        <div className="flex items-center space-x-2">
          <input
            {...register('isActive')}
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Producto activo
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createProductMutation.isPending || updateProductMutation.isPending}
          >
            {isEdit ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </div>
      </form>
    </Modal>
  );
};