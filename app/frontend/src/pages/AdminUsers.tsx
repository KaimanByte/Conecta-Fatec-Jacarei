import { Pencil, Plus, Save, Search, ShieldCheck, Trash2, UserCog, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminUsers } from '../hooks/useAdminUsers';
import type { UserRole } from '../types';
import './AdminUsers.css';

type AdminAssignableRole = Extract<UserRole, 'admin' | 'secretary'>;

const roleLabels: Record<AdminAssignableRole, string> = {
  admin: 'Administrador',
  secretary: 'Secretaria',
};

const roleOptions: AdminAssignableRole[] = ['secretary', 'admin'];

const AdminUsers = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const {
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
  } = useAdminUsers();

  const updateEditingUser = (changes: Partial<typeof editingUser>) => {
    setEditingUser({ ...editingUser, ...changes });
  };

  return (
    <AdminLayout setToken={setToken}>
      <div className="admin-users-header">
        <div>
          <h2 className="admin-users-title">Gestão de Usuários</h2>
          <p className="admin-users-subtitle">Gerencie acessos administrativos e permissões do sistema</p>
        </div>

        <button onClick={openCreateModal} className="admin-users-create-button" type="button">
          <Plus size={20} />
          NOVO USUÁRIO
        </button>
      </div>

      <div className="admin-users-search-wrapper">
        <Search className="admin-users-search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar usuário por e-mail..."
          className="admin-users-search-input"
        />
      </div>

      <div className="admin-users-card">
        {loading ? (
          <div className="admin-users-skeleton-wrapper">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr className="admin-users-table-head-row">
                  <th>Usuário</th>
                  <th>Permissão</th>
                  <th className="admin-users-actions-head">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="admin-users-empty">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="admin-users-table-row">
                      <td className="admin-users-user-cell">
                        <div className="admin-users-user-icon">
                          <UserCog size={18} />
                        </div>
                        <div>
                          <span className="admin-users-email">{user.email}</span>
                          <span className="admin-users-id">#{user.id}</span>
                        </div>
                      </td>

                      <td className="admin-users-role-cell">
                        <span className={`admin-users-role-badge admin-users-role-badge--${user.role}`}>
                          <ShieldCheck size={14} />
                          {roleLabels[user.role]}
                        </span>
                      </td>

                      <td className="admin-users-actions-cell">
                        <button
                          onClick={() => openEditModal(user)}
                          className="admin-users-edit-button"
                          title="Editar"
                          type="button"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteUser(user.id)}
                          className="admin-users-delete-button"
                          title="Excluir"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-users-modal-overlay">
          <div className="admin-users-drawer">
            <div className="admin-users-modal-header">
              <h3 className="admin-users-modal-title">
                {editingUser?.id ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>

              <button onClick={closeModal} className="admin-users-close-button" type="button">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={saveUser} className="admin-users-form">
              <div className="admin-users-form-group">
                <label htmlFor="user-email">E-mail</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  className="admin-users-form-input"
                  value={editingUser?.email || ''}
                  onChange={(event) => updateEditingUser({ email: event.target.value })}
                  placeholder="usuario@fatec.sp.gov.br"
                />
              </div>

              <div className="admin-users-form-group">
                <label htmlFor="user-role">Permissão</label>
                <select
                  id="user-role"
                  className="admin-users-form-input"
                  value={editingUser?.role ?? 'secretary'}
                  onChange={(event) => updateEditingUser({ role: event.target.value as AdminAssignableRole })}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-users-form-group">
                <label htmlFor="user-password">
                  {editingUser?.id ? 'Nova senha' : 'Senha'}
                </label>
                <input
                  id="user-password"
                  type="password"
                  className="admin-users-form-input"
                  minLength={8}
                  required={!editingUser?.id}
                  value={editingUser?.password || ''}
                  onChange={(event) => updateEditingUser({ password: event.target.value })}
                  placeholder={editingUser?.id ? 'Preencha apenas se quiser alterar' : 'Mínimo de 8 caracteres'}
                />
                {editingUser?.id && (
                  <p className="admin-users-form-help">Deixe em branco para manter a senha atual.</p>
                )}
              </div>

              <div className="admin-users-submit-wrapper">
                <button type="submit" className="admin-users-save-button">
                  <Save size={20} />
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
