import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'sonner';
import axios from 'axios';

const Login = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingToken, setCheckingToken] = useState(true);

  const navigate = useNavigate();

  const removeTokenAndStayOnLogin = () => {
    localStorage.removeItem('token');

    if (setToken) {
      setToken(null);
    }

    setCheckingToken(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', data.token);

      if (setToken) {
        setToken(data.token);
      }

      toast.success('Bem-vindo ao Painel!');
      navigate('/admin/inquiries');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || 'Erro no login. Verifique suas credenciais.');
        return;
      }

      toast.error('Erro inesperado no login.');
    }
  };

  useEffect(() => {
    const validateExistingToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setCheckingToken(false);
        return;
      }

      try {
        await api.get('/auth/validate-secretary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (setToken) {
          setToken(token);
        }

        navigate('/admin/inquiries');
      } catch {
        removeTokenAndStayOnLogin();
      }
    };

    validateExistingToken();
  }, [navigate, setToken]);

  if (checkingToken) {
    return <p>Verificando login...</p>;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-avatar">
          <img src="/fatec_jacarei.png" alt="Avatar" />
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