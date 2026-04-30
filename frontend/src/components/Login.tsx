import { useState, useEffect } from 'react';
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (setToken) setToken(token);
      navigate('/admin');
    }
  }, [navigate, setToken]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-avatar">
          {/* Substituímos o SVG por uma imagem */}
          <img src='/fatec_jacarei.png' alt="Avatar" />
        </div>
        <h2 className="login-title">LOGIN ADMIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fatec.edu"
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
              required
            />
            <div className="forgot-password">ESQUECI A SENHA</div>
          </div>
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;