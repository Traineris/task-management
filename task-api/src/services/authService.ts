import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import * as authRepository from '../repositories/authRepository';
import { RegisterInput, LoginInput } from '../validations/authValidation';
import { CustomError } from '../utils/customError';
import { env } from '../config/env.config';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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

  const token = generateToken(newUser._id.toString(), newUser.email);

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
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
