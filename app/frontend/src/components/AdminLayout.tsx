import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ListTree, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const AdminLayout = ({ children, setToken }: { children: ReactNode, setToken?: (v: string | null) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('theme') === 'dark';
});

type UserRole = 'student' | 'secretary' | 'admin';

interface JWT_Payload {
  id: number;
  role: UserRole;
}
const [userRole, setUserRole] = useState<UserRole | null>(null);

useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return;
  }

  try {
    const decoded = jwtDecode<JWT_Payload>(token);
    setUserRole(decoded.role);
  } catch (error) {
    localStorage.removeItem('token');
    navigate('/login');
  }
}, [navigate]);

const [sidebarOpen, setSidebarOpen] = useState(true);

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
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, roles: ['admin'] as UserRole[]},
  { name: 'Gestão de Nós', path: '/admin/nodes', icon: <ListTree size={20} />,roles: ['admin'] as UserRole[]},
  { name: 'Dúvidas', path: '/admin/inquiries', icon: <MessageSquare size={20} />, roles: ['secretary', 'admin'] as UserRole[]},
  { name: 'Logs e Satisfação', path: '/admin/logs', icon: <ChevronRight size={20} />, roles: ['admin'] as UserRole[],}
];

const visibleMenuItems = menuItems.filter((item) => {
  if (!userRole) return false;
  return item.roles.includes(userRole);
});

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      {/*INICIO*/}<aside className={`admin-sidebar ${!sidebarOpen ? 'admin-sidebar--hidden' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="sidebar-logo">
              <img src="/fatec_jacarei.png"></img>
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
        {/* <nav className="sidebar-nav">
            <Link key='/admin/inquiries' to='/admin/inquiries' className={`nav-link ${location.pathname === '/admin/inquiries' ? 'nav-link--active' : ''}`}
            >
              {<MessageSquare size={20} />}
              <span className="nav-link-label">Dúvidas</span>
            </Link>
        </nav> */}

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span className="nav-link-label">Sair</span>
          </button>
        </div>
      </aside> {/*FIM*/}

      <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="sidebar-toggle-btn"
          >
            <ChevronRight 
              size={20} 
              className={!sidebarOpen ? '' : 'rotate'} 
            />
          </button>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          
          {/*<h1 className="header-title">
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
          </div>*/}
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;