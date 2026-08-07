import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  code: z.string().length(6, 'Kode OTP harus 6 digit'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'ID Token Google wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
