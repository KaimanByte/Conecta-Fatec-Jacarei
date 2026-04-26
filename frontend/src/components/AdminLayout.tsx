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
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 dark:bg-slate-900 text-white shadow-xl flex flex-col transition-colors">
        <div className="p-6 border-b border-indigo-800 dark:border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-white text-indigo-900 w-8 h-8 rounded-lg flex items-center justify-center">🎓</span>
            Painel Admin
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-indigo-700 dark:bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:bg-indigo-800 dark:hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-indigo-300 hover:text-white hover:bg-indigo-800 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-10 transition-colors">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Administração'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-full">
              <button 
                onClick={() => setDarkMode(false)}
                className={`p-1.5 rounded-full transition-all ${!darkMode ? 'bg-white shadow-sm text-amber-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => setDarkMode(true)}
                className={`p-1.5 rounded-full transition-all ${darkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Moon size={18} />
              </button>
            </div>

            <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Ver Chatbot</Link>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
              A
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
