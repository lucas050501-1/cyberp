import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Flower, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth';
import { useToast } from '../../components/ui/Toast';
import { forgotPasswordSchema } from '../../utils/validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPassword(data.email),
    onSuccess: () => {
      setEmailSent(true);
      showSuccess('Email de recuperación enviado');
    },
    onError: (error) => {
      showError(error.message || 'Error al enviar email');
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <Flower className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Enviado
          </h2>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un enlace de recuperación a tu email. 
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Flower className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="tu@email.com"
            error={errors.email?.message}
          />

          <Button
            type="submit"
            className="w-full"
            loading={forgotPasswordMutation.isPending}
          >
            Enviar Enlace de Recuperación
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};