import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminUserService, type AdminUserFormData } from '../services/adminUserService';
import type { AdminUser } from '../types';

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'error' in error.response.data &&
    typeof error.response.data.error === 'string'
  ) {
    return error.response.data.error;
  }

  return 'Erro ao processar solicitação.';
};

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<AdminUserFormData> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);

    try {
      const userList = await adminUserService.list(search);
      setUsers(userList);
    } catch {
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const openCreateModal = () => {
    setEditingUser({ email: '', password: '', role: 'secretary' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser({ ...user, password: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await adminUserService.remove(id);
      toast.success('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const saveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;

    const userData: AdminUserFormData = {
      id: editingUser.id,
      email: editingUser.email?.trim() ?? '',
      password: editingUser.password?.trim() || undefined,
      role: editingUser.role ?? 'secretary',
    };

    if (!userData.id && !userData.password) {
      toast.error('A senha é obrigatória para criar um novo usuário.');
      return;
    }

    try {
      await toast.promise(adminUserService.save(userData), {
        loading: userData.id ? 'Atualizando usuário...' : 'Criando novo usuário...',
        success: userData.id ? 'Usuário atualizado!' : 'Usuário criado com sucesso!',
        error: (error) => getErrorMessage(error),
      });

      closeModal();
      loadUsers();
    } catch {
      // toast.promise já mostra o erro.
    }
  };

  return {
    users,
    loading,
    editingUser,
    setEditingUser,
    isModalOpen,
    search,
    setSearch,
    openCreateModal,
    openEditModal,
    closeModal,
    deleteUser,
    saveUser,
  };
}
