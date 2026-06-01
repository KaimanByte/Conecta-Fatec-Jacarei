import { Response } from 'express';
import { AppError } from '../errors/AppError.js'; 

export const isInvalidId = (value: string | undefined): boolean => {
  return value !== undefined && isNaN(Number(value));
};

export const handleError = (
  err: unknown,
  res: Response,
  fallbackMessage = 'Erro interno do servidor'
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    error: fallbackMessage,
  });
};