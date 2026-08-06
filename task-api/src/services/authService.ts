import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import * as authRepository from '../repositories/authRepository';
import { RegisterInput, LoginInput } from '../validations/authValidation';
import { CustomError } from '../utils/customError';
import { env } from '../config/env.config';

const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
};

export const register = async (input: RegisterInput) => {
  const existingUser = await authRepository.findUserByEmail(input.email);
  if (existingUser) {
    throw new CustomError('Email sudah terdaftar', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const newUser = await authRepository.createUser({
    ...input,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};


export const login = async (input: LoginInput) => {
  const user = await authRepository.findUserByEmail(input.email);
  if (!user) {
    throw new CustomError('Email atau password salah', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new CustomError('Email atau password salah', StatusCodes.UNAUTHORIZED);
  }

  const token = generateToken(user._id.toString(), user.email);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
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

