# FloraShop - E-commerce Frontend

Un frontend moderno y completo para e-commerce de flores desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

### Funcionalidades Principales
- **Autenticación completa**: Registro, login, recuperación de contraseña con validaciones
- **Catálogo avanzado**: Filtros, búsqueda, paginación y detalles de productos
- **Carrito inteligente**: Validación de stock, controles de cantidad y totales en tiempo real
- **Checkout seguro**: Múltiples métodos de pago y validación de datos
- **Panel de administración**: Gestión de productos, usuarios, inventario y estadísticas
- **Modo mock**: Desarrollo independiente sin necesidad de backend

### Tecnologías Utilizadas
- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **React Router** para navegación
- **TanStack Query** para manejo de estado del servidor
- **Tailwind CSS** para estilos
- **React Hook Form** + **Yup** para formularios y validaciones
- **Recharts** para gráficos y estadísticas
- **Lucide React** para iconos
- **Vitest** + **React Testing Library** para testing

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd florashop-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true

# Application Configuration
VITE_APP_NAME=FloraShop
VITE_APP_VERSION=1.0.0
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración de Entorno

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend API | `http://localhost:8000/api` |
| `VITE_USE_MOCK` | Usar servicios mock (true/false) | `true` |
| `VITE_APP_NAME` | Nombre de la aplicación | `FloraShop` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

### Modo Mock vs Producción

**Modo Mock (`VITE_USE_MOCK=true`)**:
- Utiliza datos simulados almacenados localmente
- Simula latencia de red y errores aleatorios
- Perfecto para desarrollo y testing sin backend
- Permite que QA y PMO prueben funcionalidades

**Modo Producción (`VITE_USE_MOCK=false`)**:
- Se conecta al backend real via `VITE_API_BASE_URL`
- Requiere backend Python (FastAPI/Django) funcionando
- Manejo real de autenticación JWT
- Persistencia real de datos

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   └── providers/      # Context providers
├── features/           # Funcionalidades por módulo
│   ├── auth/          # Autenticación (Login, Register, etc.)
│   ├── catalog/       # Catálogo de productos
│   ├── cart/          # Carrito de compras
│   ├── checkout/      # Proceso de checkout
│   ├── profile/       # Perfil de usuario
│   ├── orders/        # Gestión de pedidos
│   └── admin/         # Panel de administración
├── hooks/             # Custom hooks
├── services/          # Capa de servicios API
│   └── mock/          # Servicios mock para desarrollo
├── types/             # Definiciones de TypeScript
├── utils/             # Utilidades y helpers
└── test/              # Tests unitarios
```

## 🔐 Autenticación y Roles

### Roles de Usuario
- **Cliente**: Acceso a catálogo, carrito, checkout y perfil
- **Empleado**: Acceso adicional a gestión de productos e inventario
- **Administrador**: Acceso completo incluyendo gestión de usuarios

### Credenciales de Prueba (Modo Mock)
```
Admin: admin@florashop.com / password123
Empleado: employee@florashop.com / password123
Cliente: cliente@email.com / password123
```

## 🛒 Funcionalidades Principales

### Catálogo
- Filtros por nombre, categoría, rango de precio y stock
- Paginación automática
- Vista de detalle con recomendaciones
- Imágenes optimizadas y responsive

### Carrito
- Validación de stock en tiempo real
- Controles de cantidad con límites
- Cálculo automático de totales
- Persistencia local en modo mock

### Checkout
- Formulario completo con validaciones
- Múltiples métodos de pago
- Validación de stock antes de confirmar
- Resumen detallado del pedido

### Administración
- Dashboard con estadísticas y gráficos
- CRUD completo de productos
- Gestión de usuarios y roles
- Control de inventario con alertas

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Tests Incluidos
- **Smoke tests** en páginas críticas (Login, Catalog, Cart, Checkout)
- **Validación de formularios**
- **Componentes UI**
- **Servicios mock**

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

### Configuración para Producción
1. Configurar `VITE_USE_MOCK=false`
2. Establecer `VITE_API_BASE_URL` apuntando al backend
3. Configurar variables de entorno en el servidor
4. Ejecutar build y servir archivos estáticos

## 🔌 Integración con Backend

### Endpoints Esperados

**Autenticación**:
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/forgot-password` - Recuperar contraseña
- `POST /auth/logout` - Cerrar sesión

**Productos**:
- `GET /products` - Listar productos con filtros
- `GET /products/search` - Búsqueda de productos
- `GET /products/:id` - Detalle de producto
- `POST /products` - Crear producto (admin)
- `PUT /products/:id` - Actualizar producto (admin)
- `DELETE /products/:id` - Eliminar producto (admin)

**Carrito**:
- `GET /cart` - Obtener carrito
- `POST /cart` - Agregar al carrito
- `PUT /cart/:itemId` - Actualizar cantidad
- `DELETE /cart/:itemId` - Eliminar del carrito
- `POST /cart/check-stock` - Validar stock

**Pedidos**:
- `GET /orders/mine` - Mis pedidos
- `GET /orders/:id` - Detalle de pedido
- `POST /orders` - Crear pedido
- `GET /orders` - Todos los pedidos (admin)

**Usuarios** (admin):
- `GET /users` - Listar usuarios
- `PUT /users/:id/role` - Cambiar rol
- `DELETE /users/:id` - Eliminar usuario

**Estadísticas** (admin):
- `GET /stats/sales` - Estadísticas de ventas
- `GET /stats/top-products` - Productos más vendidos

### Formato de Respuestas
```typescript
// Respuesta exitosa
{
  "data": T,
  "message": "string",
  "success": true
}

// Respuesta paginada
{
  "data": T[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}

// Respuesta de error
{
  "message": "string",
  "success": false
}
```

### Autenticación JWT
- Token enviado en header: `Authorization: Bearer <token>`
- Payload del token debe incluir información del usuario
- Manejo automático de tokens expirados

## 🎨 Diseño y UX

### Sistema de Colores
- **Primario**: Emerald (verde) - `#10B981`
- **Secundario**: Pink (rosa) - `#F472B6`
- **Acento**: Orange (naranja) - `#F97316`
- **Estados**: Success, Warning, Error con variaciones

### Responsive Design
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Accesibilidad
- Labels apropiados en formularios
- Atributos ARIA para lectores de pantalla
- Manejo de foco en modales
- Contraste de colores adecuado
- Navegación por teclado

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de conexión con backend**:
- Verificar que `VITE_API_BASE_URL` esté configurado correctamente
- Asegurar que el backend esté ejecutándose
- Cambiar a modo mock temporalmente: `VITE_USE_MOCK=true`

**Problemas de autenticación**:
- Limpiar localStorage: `localStorage.clear()`
- Verificar formato del token JWT
- Revisar configuración de CORS en backend

**Errores de build**:
- Limpiar cache: `rm -rf node_modules package-lock.json && npm install`
- Verificar versiones de Node.js y npm
- Revisar imports y exports

## 📝 Contribución

1. Fork el proyecto
2. Crear rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🤝 Soporte

Para soporte técnico o preguntas:
- Email: soporte@florashop.com
- Documentación: [Enlace a docs]
- Issues: [GitHub Issues]