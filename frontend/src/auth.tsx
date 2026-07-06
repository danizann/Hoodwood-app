import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, setApiToken } from './api';

export type Role = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

interface AuthContextValue {
  isReady: boolean;
  user: User | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const TOKEN_KEY = 'hoodwood_token';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsReady(true);
      return;
    }

    setApiToken(stored);
    api
      .get<{ user: User }>('/auth/me')
      .then((response) => {
        setToken(stored);
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setApiToken(null);
      })
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      user,
      token,
      async login(email: string, password: string) {
        const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
        localStorage.setItem(TOKEN_KEY, response.data.token);
        setApiToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        setApiToken(null);
        setToken(null);
        setUser(null);
      }
    }),
    [isReady, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
