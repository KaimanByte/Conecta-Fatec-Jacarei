import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// --- Esquemas de Validação ---

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres')
});

export const nodeSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  content: z.string().optional(),
  parentId: z.number().nullable().optional()
});

export const inquirySchema = z.object({
  requesterName: z.string().min(3, 'Nome muito curto'),
  requesterEmail: z.string().email('E-mail inválido'),
  question: z.string().min(10, 'A dúvida deve ser mais detalhada'),
  sessionId: z.string().optional()
});

export const answerSchema = z.object({
  answerText: z.string().min(5, 'A resposta deve ser mais detalhada')
});

// --- Middleware de Validação ---

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Erro de validação', 
        details: error.issues.map(issue => ({ path: issue.path, message: issue.message })) 
      });
    }
    next(error);
  }
};
