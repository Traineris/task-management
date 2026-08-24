import { StatusCodes } from 'http-status-codes';
import * as sprintRepository from '../repositories/sprintRepository';
import * as projectRepository from '../repositories/projectRepository';
import { CreateSprintInput, UpdateSprintInput } from '../validations/sprintValidation';
import { CustomError } from '../utils/customError';

const checkProjectAccess = async (projectId: string, userId: string, userRole: string, mustBeLead = false) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const isLead = project.leadId._id.toString() === userId;
  const isMember = project.members.some((member: any) => member._id.toString() === userId);

  if (mustBeLead) {
    if (!isLead && userRole !== 'ADMIN') {
      throw new CustomError('Akses ditolak. Hanya Project Lead atau ADMIN yang dapat mengelola Sprint.', StatusCodes.FORBIDDEN);
    }
  } else {
    if (!isLead && !isMember && userRole !== 'ADMIN') {
      throw new CustomError('Akses ditolak. Anda bukan anggota dari project ini.', StatusCodes.FORBIDDEN);
    }
  }

  return project;
};

export const getSprints = async (projectId: string, userId: string, userRole: string) => {
  await checkProjectAccess(projectId, userId, userRole, false);
  return sprintRepository.findSprintsByProjectId(projectId);
};

export const createSprint = async (userId: string, userRole: string, input: CreateSprintInput) => {
  await checkProjectAccess(input.projectId, userId, userRole, true);
  return sprintRepository.createSprint(input);
};

export const updateSprint = async (
  id: string,
  userId: string,
  userRole: string,
  input: UpdateSprintInput
) => {
  const sprint = await sprintRepository.findSprintById(id);
  if (!sprint) {
    throw new CustomError('Sprint tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  await checkProjectAccess(sprint.projectId.toString(), userId, userRole, true);

  if (input.status === 'ACTIVE') {
    const activeSprint = await sprintRepository.findActiveSprintByProjectId(sprint.projectId.toString());
    if (activeSprint && activeSprint._id.toString() !== id) {
      throw new CustomError('Hanya satu Sprint yang boleh aktif dalam satu waktu.', StatusCodes.CONFLICT);
    }
  }

  return sprintRepository.updateSprint(id, input);
};

export const deleteSprint = async (id: string, userId: string, userRole: string) => {
  const sprint = await sprintRepository.findSprintById(id);
  if (!sprint) {
    throw new CustomError('Sprint tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  await checkProjectAccess(sprint.projectId.toString(), userId, userRole, true);
  await sprintRepository.deleteSprint(id);
  return { message: 'Sprint berhasil dihapus' };
};
