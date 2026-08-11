import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from './authMiddleware';
import { CustomError } from '../utils/customError';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Akses ditolak. Fitur ini hanya untuk pengguna dengan role: ${allowedRoles.join(', ')}`,
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};
