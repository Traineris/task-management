import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/customError';
import { env } from '../config/env.config';
import { UserModel } from '../models/userModel';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    tokenVersion?: number;
  };
}

export const authenticateToken = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new CustomError('Akses ditolak, token tidak ditemukan', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: string; tokenVersion?: number };

    const user = await UserModel.findById(decoded.id).select('tokenVersion role');
    if (!user || (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion)) {
      return next(new CustomError('Sesi telah berakhir (logout), silakan login kembali', StatusCodes.UNAUTHORIZED));
    }

    req.user = {
      ...decoded,
      role: user.role || decoded.role || 'USER',
    };
    next();
  } catch (error) {
    return next(new CustomError('Token tidak valid atau telah kadaluarsa', StatusCodes.FORBIDDEN));
  }
};
