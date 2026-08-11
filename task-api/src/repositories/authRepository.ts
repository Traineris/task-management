import { UserModel, IUser } from '../models/userModel';
import { RegisterInput } from '../validations/authValidation';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email: email.toLowerCase().trim() });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return UserModel.findById(id).select('-password -otpCode -otpExpiresAt');
};

export const createUser = async (data: RegisterInput & { otpCode: string; otpExpiresAt: Date }): Promise<IUser> => {
  return UserModel.create({
    ...data,
    email: data.email.toLowerCase().trim(),
  });
};

export const updateOtp = async (userId: string, otpCode: string, otpExpiresAt: Date): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, { otpCode, otpExpiresAt });
};

export const setVerified = async (userId: string): Promise<IUser | null> => {
  return UserModel.findByIdAndUpdate(
    userId,
    { isVerified: true, $unset: { otpCode: 1, otpExpiresAt: 1 } },
    { new: true }
  ).select('-password');
};

export const upsertGoogleUser = async (data: {
  name: string;
  email: string;
  avatar?: string;
}): Promise<IUser> => {
  const email = data.email.toLowerCase().trim();
  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      name: data.name,
      email,
      avatar: data.avatar,
      authProvider: 'google',
      isVerified: true,
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    if (data.avatar) user.avatar = data.avatar;
    await user.save();
  }

  return user;
};

export const updatePassword = async (userId: string, hashedPassword: string): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, {
    password: hashedPassword,
    $unset: { otpCode: 1, otpExpiresAt: 1 },
  });
};

export const updateUserProfile = async (
  userId: string,
  data: { name?: string; avatar?: string; jobTitle?: string; role?: 'USER' | 'ADMIN' }
): Promise<IUser | null> => {
  return UserModel.findByIdAndUpdate(userId, data, { new: true }).select('-password -otpCode -otpExpiresAt');
};

export const incrementTokenVersion = async (userId: string): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
};

export const findAllUsers = async (): Promise<IUser[]> => {
  return UserModel.find().select('-password -otpCode -otpExpiresAt');
};

export const updateUserRole = async (userId: string, role: 'USER' | 'ADMIN'): Promise<IUser | null> => {
  return UserModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-password -otpCode -otpExpiresAt');
};




