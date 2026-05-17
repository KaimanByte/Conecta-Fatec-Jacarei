import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export type AccessValidator = 'admin' | 'secretary';

export function usePrivateAccess(
  validator: AccessValidator,
  setToken?: (value: string | null) => void,
) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    const validateAccess = async () => {
      const token = authService.getToken();

      if (!token) {
        setToken?.(null);
        setStatus('denied');
        return;
      }

      try {
        if (validator === 'admin') {
          await authService.validateAdmin();
        } else {
          await authService.validateSecretary();
        }

        setStatus('allowed');
      } catch {
        authService.clearToken();
        setToken?.(null);
        setStatus('denied');
      }
    };

    validateAccess();
  }, [setToken, validator]);

  return status;
}
