import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
import type { JwtPayload, LoginResponse } from '../types';

const TOKEN_KEY = 'token';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  },

  async login(email: string, password: string): Promise<string> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data.token;
  },

  async validateAdmin(): Promise<void> {
    await api.get('/auth/validate-admin');
  },

  async validateSecretary(): Promise<void> {
    await api.get('/auth/validate-secretary');
  },
};
