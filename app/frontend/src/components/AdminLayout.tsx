import { type ReactNode, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, LayoutDashboard, ListTree, LogOut, MessageSquare } from 'lucide-react';
import { authService } from '../services/authService';
import { useTheme } from '../hooks/useTheme';
import type { UserRole } from '../types';

interface AdminLayoutProps {
  children: ReactNode;
  setToken?: (value: string | null) => void;
}

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, roles: ['admin'] as UserRole[] },
  { name: 'Gestão de Nós', path: '/admin/nodes', icon: <ListTree size={20} />, roles: ['admin'] as UserRole[] },
  { name: 'Dúvidas', path: '/admin/inquiries', icon: <MessageSquare size={20} />, roles: ['secretary', 'admin'] as UserRole[] },
  { name: 'Logs e Satisfação', path: '/admin/logs', icon: <ChevronRight size={20} />, roles: ['admin'] as UserRole[] },
];

const AdminLayout = ({ children, setToken }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useTheme();

  const userRole = useMemo<UserRole | null>(() => {
    const token = authService.getToken();

    if (!token) {
      return null;
    }

    try {
      return authService.decodeToken(token).role;
    } catch {
      return null;
    }
  }, []);

  const visibleMenuItems = menuItems.filter((item) => userRole && item.roles.includes(userRole));

  const handleLogout = () => {
    authService.clearToken();
    setToken?.(null);
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${!sidebarOpen ? 'admin-sidebar--hidden' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="sidebar-logo">
              <img src="/fatec_jacarei.png" alt="Fatec Jacareí" />
            </span>
            Secretária
          </h2>
        </div>

        <nav className="sidebar-nav">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
            >
              {item.icon}
              <span className="nav-link-label">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" type="button">
            <LogOut size={20} />
            <span className="nav-link-label">Sair</span>
          </button>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen((currentValue) => !currentValue)}
        className="sidebar-toggle-btn"
        type="button"
        aria-label="Alternar menu lateral"
      >
        <ChevronRight size={20} className={sidebarOpen ? 'rotate' : ''} />
      </button>

      <main className="admin-main">
        <header className="admin-header" />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
