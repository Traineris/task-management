import rateLimit from 'express-rate-limit';

const isTest = () => process.env.NODE_ENV === 'test';

// 1. Anti Brute-Force Login: Max 5 percobaan per 15 menit per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Akun Anda sementara diproteksi, silakan coba 15 menit lagi.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTest,
});

// Backwards compatibility alias
export const authLimiter = loginLimiter;

// 2. Anti Brute-Force OTP: Max 5 percobaan verifikasi kode OTP per 15 menit
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan verifikasi kode OTP yang salah. Silakan coba 15 menit lagi.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTest,
});

// 3. Anti-Flooding / Anti-Bombing Email OTP: Max 3 pengiriman per 15 menit
export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Permintaan pengiriman kode OTP terlalu sering. Silakan tunggu 15 menit sebelum meminta kode baru.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTest,
});
