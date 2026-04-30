import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ListTree, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';

const AdminLayout = ({ children, setToken }: { children: ReactNode, setToken?: (v: string | null) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setToken) setToken(null);
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Gestão de Nós', path: '/admin/nodes', icon: <ListTree size={20} /> },
    { name: 'Dúvidas', path: '/admin/inquiries', icon: <MessageSquare size={20} /> },
    { name: 'Logs e Satisfação', path: '/admin/logs', icon: <ChevronRight size={20} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="sidebar-logo">🎓</span>
            Painel Admin
          </h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
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
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span className="nav-link-label">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="header-title">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Administração'}
          </h1>
          <div className="header-actions">
            <div className="theme-toggle">
              <button
                onClick={() => setDarkMode(false)}
                className={`theme-btn ${!darkMode ? 'theme-btn--active-light' : ''}`}
              >
                <Sun size={18} />
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`theme-btn ${darkMode ? 'theme-btn--active-dark' : ''}`}
              >
                <Moon size={18} />
              </button>
            </div>

            <Link to="/" className="view-chatbot-link">Ver Chatbot</Link>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;