import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Edit, Trash2 } from 'lucide-react';
import { userService } from '../../services/users';
import { useToast } from '../../components/ui/Toast';
import { formatDateTime } from '../../utils/format';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

export const UsersAdmin: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<User['role']>('client');

  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const {
    data: usersResponse,
    isLoading,
  } = useQuery({
    queryKey: ['admin-users', { search, role: roleFilter }],
    queryFn: () => userService.getUsers({
      search: search || undefined,
      role: roleFilter || undefined,
      page: 1,
      limit: 100,
    }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: User['role'] }) =>
      userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showSuccess('Rol actualizado exitosamente');
      setShowRoleModal(false);
      setEditingUser(null);
    },
    onError: (error) => {
      showError(error.message || 'Error al actualizar rol');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showSuccess('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      showError(error.message || 'Error al eliminar usuario');
    },
  });

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleUpdateRole = () => {
    if (editingUser) {
      updateRoleMutation.mutate({
        userId: editingUser.id,
        role: newRole,
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'employee': return 'warning';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'employee': return 'Empleado';
      default: return 'Cliente';
    }
  };

  const users = usersResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Gestión de Usuarios
        </h2>
        <p className="text-gray-600 mt-1">
          Administra roles y permisos de usuarios
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Todos los roles</option>
            <option value="client">Clientes</option>
            <option value="employee">Empleados</option>
            <option value="admin">Administradores</option>
          </select>

          {(search || roleFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setRoleFilter('');
              }}
            >
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDateTime(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Role Edit Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Cambiar Rol de Usuario"
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              Cambiar rol de <strong>{editingUser?.firstName} {editingUser?.lastName}</strong>
            </p>
            
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as User['role'])}
              label="Nuevo Rol"
              options={[
                { value: 'client', label: 'Cliente' },
                { value: 'employee', label: 'Empleado' },
                { value: 'admin', label: 'Administrador' },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRoleModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateRole}
              loading={updateRoleMutation.isPending}
            >
              Actualizar Rol
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};