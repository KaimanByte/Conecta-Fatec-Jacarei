import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'sonner';

const Login = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      if (setToken) setToken(data.token);
      toast.success('Bem-vindo ao Painel Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro no login. Verifique suas credenciais.');
    }
  };

  // Auto login if token
  if (localStorage.getItem('token')) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="admin@fatec.edu"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="admin"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          Entrar no Painel
        </button>
      </form>
    </div>
  );
};

export default Login;
