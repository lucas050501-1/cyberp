import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, Building, Truck, Check } from 'lucide-react';
import { cartService } from '../../services/cart';
import { orderService } from '../../services/orders';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { checkoutSchema } from '../../utils/validation';
import { formatPrice } from '../../utils/format';
import { PAYMENT_METHODS } from '../../utils/constants';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'card' | 'transfer' | 'cash_on_delivery';
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const watchedPaymentMethod = watch('paymentMethod');

  const {
    data: cartData,
    isLoading: isLoadingCart,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    onSuccess: setCart,
  });

  const stockCheckMutation = useMutation({
    mutationFn: cartService.checkStock,
    onError: (error) => {
      showError(error.message || 'Error al validar stock');
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (order) => {
      setCart(null);
      showSuccess('¡Pedido creado exitosamente!');
      navigate(`/orders/${order.id}`);
    },
    onError: (error) => {
      showError(error.message || 'Error al procesar el pedido');
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    // Validate stock before proceeding
    try {
      const stockCheck = await stockCheckMutation.mutateAsync();
      if (!stockCheck.valid) {
        showError(`Stock insuficiente: ${stockCheck.errors.join(', ')}`);
        return;
      }
    } catch (error) {
      return; // Error already handled by mutation
    }

    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    const formData = watch();
    createOrderMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: 'Colombia',
      },
      paymentMethod: formData.paymentMethod,
    });
    setShowConfirmation(false);
  };

  const cancelCheckout = () => {
    navigate('/cart');
    setShowCancelConfirm(false);
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al Carrito
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register('firstName')}
                  label="Nombre"
                  placeholder="Juan"
                  error={errors.firstName?.message}
                />
                <Input
                  {...register('lastName')}
                  label="Apellido"
                  placeholder="Pérez"
                  error={errors.lastName?.message}
                />
                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                />
                <Input
                  {...register('phone')}
                  type="tel"
                  label="Teléfono"
                  placeholder="+57 300 123 4567"
                  error={errors.phone?.message}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Dirección de Entrega
              </h2>
              <div className="space-y-4">
                <Input
                  {...register('street')}
                  label="Dirección"
                  placeholder="Calle 123 #45-67"
                  error={errors.street?.message}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    {...register('city')}
                    label="Ciudad"
                    placeholder="Bogotá"
                    error={errors.city?.message}
                  />
                  <Input
                    {...register('state')}
                    label="Departamento"
                    placeholder="Cundinamarca"
                    error={errors.state?.message}
                  />
                  <Input
                    {...register('zipCode')}
                    label="Código Postal"
                    placeholder="110111"
                    error={errors.zipCode?.message}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Método de Pago
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.value} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-emerald-500 cursor-pointer transition-colors">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value={method.value}
                      className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <div className="flex items-center space-x-2">
                      {method.value === 'card' && <CreditCard className="h-5 w-5 text-gray-600" />}
                      {method.value === 'transfer' && <Building className="h-5 w-5 text-gray-600" />}
                      {method.value === 'cash_on_delivery' && <Truck className="h-5 w-5 text-gray-600" />}
                      <span className="font-medium">{method.label}</span>
                    </div>
                  </label>
                ))}
                {errors.paymentMethod && (
                  <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Payment Method Info */}
              {watchedPaymentMethod === 'transfer' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Después de confirmar el pedido, recibirás los datos bancarios para realizar la transferencia.
                  </p>
                </div>
              )}
              {watchedPaymentMethod === 'cash_on_delivery' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Pagarás en efectivo al momento de la entrega. Asegúrate de tener el monto exacto.
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={stockCheckMutation.isPending}
            >
              Confirmar Pedido
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tu Pedido
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-emerald-600">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirmar Pedido"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas procesar este pedido por <strong>{formatPrice(total)}</strong>?
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Método de pago seleccionado:</h4>
            <p className="text-sm text-gray-600">
              {PAYMENT_METHODS.find(m => m.value === watchedPaymentMethod)?.label}
            </p>
          </div>

          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Revisar
            </Button>
            <Button
              onClick={confirmOrder}
              loading={createOrderMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Cancelar Checkout"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas cancelar el proceso de checkout? 
            Volverás al carrito y podrás continuar más tarde.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(false)}
            >
              Continuar Checkout
            </Button>
            <Button
              variant="danger"
              onClick={cancelCheckout}
            >
              Sí, Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};