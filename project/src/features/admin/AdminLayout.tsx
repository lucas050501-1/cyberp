import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Package, BarChart3, AlertTriangle } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/admin',
      label: 'Estadísticas',
      icon: BarChart3,
    },
    {
      path: '/admin/products',
      label: 'Productos',
      icon: Package,
    },
    {
      path: '/admin/users',
      label: 'Usuarios',
      icon: Users,
    },
    {
      path: '/admin/stock',
      label: 'Inventario',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona tu tienda de flores
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          {children}
        </div>
      </div>
    </div>
  );
};