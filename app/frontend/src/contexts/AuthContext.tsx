import { createContext, useContext, type ReactNode } from 'react';
import { useAuthSession, type AuthSession } from '../hooks/useAuthSession';

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authSession = useAuthSession();
  return <AuthContext.Provider value={authSession}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return context;
}
