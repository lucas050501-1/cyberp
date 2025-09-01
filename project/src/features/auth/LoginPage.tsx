import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Flower, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { loginSchema } from '../../utils/validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data.email, data.password),
    onSuccess: (response) => {
      setUser(response.user);
      showSuccess('¡Bienvenido de vuelta!');
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setAttempts(prev => prev + 1);
      showError(error.message || 'Error al iniciar sesión');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (attempts >= 3) {
      showError('Demasiados intentos fallidos. Intenta más tarde.');
      return;
    }
    loginMutation.mutate(data);
  };

  const isBlocked = attempts >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Flower className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              disabled={isBlocked}
            />

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="Tu contraseña"
                error={errors.password?.message}
                disabled={isBlocked}
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
          </div>

          {attempts > 0 && attempts < 3 && (
            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
              Intento {attempts} de 3. {3 - attempts} intentos restantes.
            </div>
          )}

          {isBlocked && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              Cuenta bloqueada temporalmente. Intenta más tarde.
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
            disabled={isBlocked}
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciales de Prueba:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@florashop.com / password123</p>
            <p><strong>Empleado:</strong> employee@florashop.com / password123</p>
            <p><strong>Cliente:</strong> cliente@email.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};