import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, googleAuthSchema } from '../validations/authValidation';
import * as authService from '../services/authService';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await authService.register(validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registrasi berhasil. Silakan verifikasi kode OTP yang dikirimkan.',
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

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = verifyOtpSchema.parse(req.body);
  const result = await authService.verifyOtp(validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Verifikasi email berhasil',
    data: result,
  });
});

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = resendOtpSchema.parse(req.body);
  const result = await authService.sendOtp(validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Kode OTP berhasil dikirim',
    data: result,
  });
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = googleAuthSchema.parse(req.body);
  const result = await authService.googleAuth(validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login Google berhasil',
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.id;
  const user = await authService.getProfile(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Profil pengguna berhasil diambil',
    data: user,
  });
});
