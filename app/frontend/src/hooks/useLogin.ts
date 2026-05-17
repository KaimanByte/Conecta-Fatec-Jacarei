import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';

export function useLogin(setToken?: (value: string | null) => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingToken, setCheckingToken] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const clearInvalidSession = () => {
    authService.clearToken();
    setToken?.(null);
    setCheckingToken(false);
  };

  useEffect(() => {
    const validateExistingToken = async () => {
      const token = authService.getToken();

      if (!token) {
        setCheckingToken(false);
        return;
      }

      try {
        await authService.validateSecretary();
        setToken?.(token);
        navigate('/admin/inquiries');
      } catch {
        clearInvalidSession();
      }
    };

    validateExistingToken();
  }, [navigate, setToken]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const token = await authService.login(email, password);
      authService.setToken(token);
      setToken?.(token);
      toast.success('Bem-vindo ao Painel!');
      navigate('/admin/inquiries');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro no login. Verifique suas credenciais.');
      } else {
        toast.error('Erro inesperado no login.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    checkingToken,
    submitting,
    handleSubmit,
  };
}
