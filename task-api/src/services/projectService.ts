import { StatusCodes } from 'http-status-codes';
import * as projectRepository from '../repositories/projectRepository';
import { CreateProjectInput, UpdateProjectInput } from '../validations/projectValidation';
import { CustomError } from '../utils/customError';

export const getProjects = async (userId: string) => {
  return projectRepository.findProjectsByUser(userId);
};

export const getProjectById = async (id: string, userId: string, userRole: string) => {
  const project = await projectRepository.findProjectById(id);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  // Pengecekan Otorisasi: Harus Lead, Member, atau ADMIN
  const isMemberOrLead =
    project.leadId._id.toString() === userId ||
    project.members.some((member: any) => member._id.toString() === userId);

  if (!isMemberOrLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Anda bukan anggota dari project ini.', StatusCodes.FORBIDDEN);
  }

  return project;
};

export const createProject = async (userId: string, input: CreateProjectInput) => {
  const existingKey = await projectRepository.findProjectByKey(input.key);
  if (existingKey) {
    throw new CustomError(`Key project '${input.key}' sudah digunakan`, StatusCodes.CONFLICT);
  }

  return projectRepository.createProject(userId, input);
};

export const updateProject = async (
  id: string,
  userId: string,
  userRole: string,
  input: UpdateProjectInput
) => {
  const project = await projectRepository.findProjectById(id);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  // Otorisasi: Hanya Lead Project atau ADMIN yang berhak update
  if (project.leadId._id.toString() !== userId && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Hanya Lead Project atau ADMIN yang dapat mengubah project.', StatusCodes.FORBIDDEN);
  }

  return projectRepository.updateProject(id, input);
};

export const deleteProject = async (id: string, userId: string, userRole: string) => {
  const project = await projectRepository.findProjectById(id);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  // Otorisasi: Hanya Lead Project atau ADMIN yang berhak hapus
  if (project.leadId._id.toString() !== userId && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Hanya Lead Project atau ADMIN yang dapat menghapus project.', StatusCodes.FORBIDDEN);
  }

  await projectRepository.deleteProject(id);
  return { message: 'Project berhasil dihapus' };
};
