import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type PrivateRouteProps = {
  validateUrl: string;
  setToken?: (v: string | null) => void;
};

const PrivateRoute = ({ validateUrl, setToken }: PrivateRouteProps) => {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    const validateAccess = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setToken?.(null);
        setStatus('denied');
        return;
      }

      try {
        const response = await fetch(validateUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setToken?.(null);
          setStatus('denied');
          return;
        }

        if (!response.ok) {
          localStorage.removeItem('token');
          setToken?.(null);
          setStatus('denied');
          return;
        }

        setStatus('allowed');
      } catch {
        localStorage.removeItem('token');
        setToken?.(null);
        setStatus('denied');
      }
    };

    validateAccess();
  }, [validateUrl, setToken]);

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;