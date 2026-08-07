import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
