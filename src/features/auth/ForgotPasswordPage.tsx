@@ .. @@
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
 }
+  const [emailSent, setEmailSent] = React.useState(false);
 
   const {
     register,
   }