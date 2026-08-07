import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { StatusCodes } from 'http-status-codes';
import * as authRepository from '../repositories/authRepository';
import { RegisterInput, LoginInput, VerifyOtpInput, ResendOtpInput, GoogleAuthInput } from '../validations/authValidation';
import { CustomError } from '../utils/customError';
import { env } from '../config/env.config';
import { sendOtpEmail } from './emailService';

const googleClient = new OAuth2Client();

const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
};

const generateOtp = (): { code: string; expiresAt: Date } => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return { code, expiresAt };
};

export const register = async (input: RegisterInput) => {
  const email = input.email.toLowerCase().trim();
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new CustomError('Email sudah terdaftar', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const { code, expiresAt } = generateOtp();

  const newUser = await authRepository.createUser({
    ...input,
    email,
    password: hashedPassword,
    otpCode: code,
    otpExpiresAt: expiresAt,
  });

  // Pengiriman Email Asli
  await sendOtpEmail(email, code);

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isVerified: newUser.isVerified,
    debugOtpCode: process.env.NODE_ENV === 'development' ? code : undefined,
  };
};

export const login = async (input: LoginInput) => {
  const email = input.email.toLowerCase().trim();
  const user = await authRepository.findUserByEmail(email);

  if (!user || !user.password) {
    throw new CustomError('Email atau password salah', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new CustomError('Email atau password salah', StatusCodes.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new CustomError('Akun Anda belum diverifikasi. Silakan verifikasi kode OTP terlebih dahulu.', StatusCodes.FORBIDDEN);
  }

  const token = generateToken(user._id.toString(), user.email);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
};

export const verifyOtp = async (input: VerifyOtpInput) => {
  const email = input.email.toLowerCase().trim();
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new CustomError('User tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  if (user.isVerified) {
    throw new CustomError('Akun sudah terverifikasi', StatusCodes.BAD_REQUEST);
  }

  if (!user.otpCode || user.otpCode !== input.code) {
    throw new CustomError('Kode OTP tidak valid', StatusCodes.BAD_REQUEST);
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    throw new CustomError('Kode OTP sudah kadaluarsa', StatusCodes.BAD_REQUEST);
  }

  const updatedUser = await authRepository.setVerified(user._id.toString());
  const token = generateToken(user._id.toString(), user.email);

  return {
    user: updatedUser,
    token,
  };
};

export const sendOtp = async (input: ResendOtpInput) => {
  const email = input.email.toLowerCase().trim();
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new CustomError('User tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  if (user.isVerified) {
    throw new CustomError('Akun sudah terverifikasi', StatusCodes.BAD_REQUEST);
  }

  const { code, expiresAt } = generateOtp();
  await authRepository.updateOtp(user._id.toString(), code, expiresAt);

  // Pengiriman Email Asli
  await sendOtpEmail(email, code);

  return {
    message: 'Kode OTP baru berhasil dikirim',
    debugOtpCode: process.env.NODE_ENV === 'development' ? code : undefined,
  };
};

export const googleAuth = async (input: GoogleAuthInput) => {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new CustomError('Google ID Token tidak valid', StatusCodes.UNAUTHORIZED);
  }

  if (!payload || !payload.email || !payload.name) {
    throw new CustomError('Gagal mendapatkan profil dari Google', StatusCodes.BAD_REQUEST);
  }

  const user = await authRepository.upsertGoogleUser({
    name: payload.name,
    email: payload.email,
    avatar: payload.picture,
  });

  const token = generateToken(user._id.toString(), user.email);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new CustomError('User tidak ditemukan', StatusCodes.NOT_FOUND);
  }
  return user;
};
