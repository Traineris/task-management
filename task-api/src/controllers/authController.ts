import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { registerSchema, loginSchema } from '../validations/authValidation';
import * as authService from '../services/authService';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await authService.register(validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registrasi berhasil',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await authService.login(validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login berhasil',
    data: result,
  });
});
