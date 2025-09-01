export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_ROLE: (id: string) => `/users/${id}/role`,
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // Cart
  CART: '/cart',
  CART_CHECK_STOCK: '/cart/check-stock',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  MY_ORDERS: '/orders/mine',
  
  // Stats
  SALES_STATS: '/stats/sales',
  TOP_PRODUCTS: '/stats/top-products',
};

export const CATEGORIES = [
  'Rosas',
  'Tulipanes',
  'Girasoles',
  'Orquídeas',
  'Lirios',
  'Claveles',
  'Margaritas',
  'Peonías',
  'Ramos',
  'Plantas',
];

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Tarjeta de Crédito/Débito' },
  { value: 'transfer', label: 'Transferencia Bancaria' },
  { value: 'cash_on_delivery', label: 'Pago Contra Entrega' },
];

export const ORDER_STATUSES = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUSES = {
  pending: 'Pendiente',
  completed: 'Completado',
  failed: 'Fallido',
};

export const ITEMS_PER_PAGE = 12;
export const MAX_RETRY_ATTEMPTS = 3;
export const CART_STORAGE_KEY = 'florashop_cart';
export const AUTH_STORAGE_KEY = 'florashop_auth';