import { UserModel, IUser } from '../models/userModel';
import { RegisterInput } from '../validations/authValidation';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return UserModel.findById(id).select('-password');
};

export const createUser = async (data: RegisterInput): Promise<IUser> => {
  return UserModel.create(data);
};
