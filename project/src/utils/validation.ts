import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().required('Contraseña es requerida'),
});

export const registerSchema = yup.object({
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email es requerido'),
});

export const productSchema = yup.object({
  name: yup.string().required('Nombre es requerido'),
  description: yup.string().required('Descripción es requerida'),
  price: yup.number().positive('El precio debe ser positivo').required('Precio es requerido'),
  category: yup.string().required('Categoría es requerida'),
  stock: yup.number().integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo').required('Stock es requerido'),
  imageUrl: yup.string().url('URL de imagen inválida').required('Imagen es requerida'),
});

export const checkoutSchema = yup.object({
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  phone: yup.string().required('Teléfono es requerido'),
  street: yup.string().required('Dirección es requerida'),
  city: yup.string().required('Ciudad es requerida'),
  state: yup.string().required('Estado es requerido'),
  zipCode: yup.string().required('Código postal es requerido'),
  paymentMethod: yup.string().oneOf(['card', 'transfer', 'cash_on_delivery']).required('Método de pago es requerido'),
});