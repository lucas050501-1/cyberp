import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      address: '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...user!,
        firstName: data.firstName,
        lastName: data.lastName,
        updatedAt: new Date().toISOString(),
      };
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditing(false);
      showSuccess('Perfil actualizado exitosamente');
    },
    onError: () => {
      showError('Error al actualizar perfil');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Información Personal
                  </h2>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register('firstName')}
                    label="Nombre"
                    disabled={!isEditing}
                    error={errors.firstName?.message}
                  />
                  <Input
                    {...register('lastName')}
                    label="Apellido"
                    disabled={!isEditing}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  disabled={!isEditing}
                  error={errors.email?.message}
                />

                <Input
                  {...register('phone')}
                  type="tel"
                  label="Teléfono"
                  placeholder="+57 300 123 4567"
                  disabled={!isEditing}
                  error={errors.phone?.message}
                />

                <Input
                  {...register('address')}
                  label="Dirección"
                  placeholder="Calle 123 #45-67, Bogotá"
                  disabled={!isEditing}
                  error={errors.address?.message}
                />

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      loading={updateProfileMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{user?.email}</p>
              <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'employee' ? 'Empleado' : 'Cliente'}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enlaces Rápidos
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/orders"
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Mis Pedidos</span>
                </Link>
                <Link 
                  to="/cart"
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Mi Carrito</span>
                </Link>
                <Link 
                  to="/contact"
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Contacto</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};