import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/customError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new CustomError('Akses ditolak, token tidak ditemukan', StatusCodes.UNAUTHORIZED));
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new CustomError('Token tidak valid atau telah kadaluarsa', StatusCodes.FORBIDDEN));
  }
};
