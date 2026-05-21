import { describe, it, expect, vi, type Mock } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { auth, rbac } from '../src/middleware/auth';

vi.mock('jsonwebtoken');

type MockResponse = Response & {
  status: Mock;
  json: Mock;
};

const mockResponse = (): MockResponse => {
  const res = {} as MockResponse;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = (): NextFunction => vi.fn() as unknown as NextFunction;

describe('Auth Middleware', () => {
  it('should return 401 if no authorization header', async () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();
    const next = mockNext();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
  });

  it('should call next if token is valid', async () => {
    const req = { headers: { authorization: 'Bearer valid-token' } } as Request;
    const res = mockResponse();
    const next = mockNext();
    const payload: JwtPayload = { id: 1, role: 'admin' };

    vi.mocked(jwt.verify).mockReturnValue(payload);

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, role: 'admin' });
  });

  it('should return 401 if token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as Request;
    const res = mockResponse();
    const next = mockNext();

    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('Invalid'); });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
  });
});

describe('RBAC Middleware', () => {
  it('should return 403 if user role is not allowed', () => {
    const req = { user: { id: 1, role: 'secretary' } } as Request;
    const res = mockResponse();
    const next = mockNext();

    const middleware = rbac(['admin']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  it('should call next if user role is allowed', () => {
    const req = { user: { id: 1, role: 'admin' } } as Request;
    const res = mockResponse();
    const next = mockNext();

    const middleware = rbac(['admin', 'secretary']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
