import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import type { UserRole } from '../types';

export interface AuthSession {
  token: string | null;
  role: UserRole | null;
  setSessionToken: (token: string | null) => void;
  clearSession: () => void;
}

export function useAuthSession(): AuthSession {
  const [token, setToken] = useState<string | null>(() => authService.getToken());

  const setSessionToken = useCallback((nextToken: string | null) => {
    if (nextToken) {
      authService.setToken(nextToken);
    } else {
      authService.clearToken();
    }

    setToken(nextToken);
  }, []);

  const clearSession = useCallback(() => {
    authService.clearToken();
    setToken(null);
  }, []);

  useEffect(() => {
    const syncToken = () => setToken(authService.getToken());
    const handler = (event: StorageEvent) => {
      if (event.key === 'token') syncToken();
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const role = useMemo<UserRole | null>(() => {
    if (!token) return null;

    try {
      return authService.decodeToken(token).role;
    } catch {
      return null;
    }
  }, [token]);

  return { token, role, setSessionToken, clearSession };
}
