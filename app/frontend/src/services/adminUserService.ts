import api from '../utils/api';
import type { AdminUser, UserRole } from '../types';

export type AdminUserFormData = {
  id?: number;
  email: string;
  password?: string;
  role: Extract<UserRole, 'admin' | 'secretary'>;
};

export const adminUserService = {
  async list(search = ''): Promise<AdminUser[]> {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    const query = params.toString();
    const { data } = await api.get<AdminUser[]>(`/admin/users${query ? `?${query}` : ''}`);
    return data;
  },

  async save(user: AdminUserFormData): Promise<void> {
    const payload = {
      email: user.email,
      role: user.role,
      ...(user.password ? { password: user.password } : {}),
    };

    if (user.id) {
      await api.put(`/admin/users/${user.id}`, payload);
      return;
    }

    await api.post('/admin/users', payload);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};
