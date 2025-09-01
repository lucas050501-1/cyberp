import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Flower, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { registerSchema } from '../../utils/validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }),
    onSuccess: (response) => {
      setUser(response.user);
      showSuccess('¡Cuenta creada exitosamente!');
      navigate('/');
    },
    onError: (error) => {
      showError(error.message || 'Error al crear la cuenta');
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Flower className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmar Contraseña"
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={registerMutation.isPending}
          >
            Crear Cuenta
          </Button>
        </form>
      </div>
    </div>
  );
};