import { describe, it, expect, vi } from 'vitest';
import { auth, rbac } from '../src/middleware/auth';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Auth Middleware', () => {
  it('should return 401 if no authorization header', async () => {
    const req = { headers: {} } as any;
    const res = mockResponse();
    const next = vi.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
  });

  it('should call next if token is valid', async () => {
    const req = { headers: { authorization: 'Bearer valid-token' } } as any;
    const res = mockResponse();
    const next = vi.fn();
    
    vi.mocked(jwt.verify).mockReturnValue({ id: 1, role: 'admin' } as any);

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, role: 'admin' });
  });

  it('should return 401 if token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as any;
    const res = mockResponse();
    const next = vi.fn();
    
    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('Invalid'); });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
  });
});

describe('RBAC Middleware', () => {
  it('should return 403 if user role is not allowed', () => {
    const req = { user: { role: 'secretary' } } as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = rbac(['admin']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  it('should call next if user role is allowed', () => {
    const req = { user: { role: 'admin' } } as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = rbac(['admin', 'secretary']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
