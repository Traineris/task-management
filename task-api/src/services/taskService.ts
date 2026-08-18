import { StatusCodes } from 'http-status-codes';
import * as taskRepository from '../repositories/taskRepository';
import * as projectRepository from '../repositories/projectRepository';
import { CreateTaskInput, UpdateTaskInput, ReorderTaskInput } from '../validations/taskValidation';
import { CustomError } from '../utils/customError';

const checkProjectAccess = async (projectId: string, userId: string, userRole: string) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const isMemberOrLead =
    project.leadId._id.toString() === userId ||
    project.members.some((member: any) => member._id.toString() === userId);

  if (!isMemberOrLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Anda bukan anggota dari project ini.', StatusCodes.FORBIDDEN);
  }

  return project;
};

export const getTasks = async (projectId: string, userId: string, userRole: string) => {
  await checkProjectAccess(projectId, userId, userRole);
  return taskRepository.findTasksByProjectId(projectId);
};

export const getTaskById = async (id: string, userId: string, userRole: string) => {
  const task = await taskRepository.findTaskById(id);
  if (!task) {
    throw new CustomError('Task tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  await checkProjectAccess(task.projectId._id.toString(), userId, userRole);
  return task;
};

export const createTask = async (userId: string, userRole: string, input: CreateTaskInput) => {
  await checkProjectAccess(input.projectId, userId, userRole);

  const maxPos = await taskRepository.getMaxPositionInStatus(input.projectId, input.status || 'TODO');
  const newPosition = maxPos + 1000;

  return taskRepository.createTask(userId, input, newPosition);
};

export const updateTask = async (
  id: string,
  userId: string,
  userRole: string,
  input: UpdateTaskInput
) => {
  const task = await taskRepository.findTaskById(id);
  if (!task) {
    throw new CustomError('Task tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  await checkProjectAccess(task.projectId._id.toString(), userId, userRole);
  return taskRepository.updateTask(id, input);
};

export const reorderTask = async (
  id: string,
  userId: string,
  userRole: string,
  input: ReorderTaskInput
) => {
  const task = await taskRepository.findTaskById(id);
  if (!task) {
    throw new CustomError('Task tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  await checkProjectAccess(task.projectId._id.toString(), userId, userRole);
  return taskRepository.updateTaskPositionAndStatus(id, input.status, input.position);
};

export const deleteTask = async (id: string, userId: string, userRole: string) => {
  const task = await taskRepository.findTaskById(id);
  if (!task) {
    throw new CustomError('Task tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const project = await checkProjectAccess(task.projectId._id.toString(), userId, userRole);

  // Otorisasi: Hapus hanya boleh oleh Reporter, Project Lead, atau ADMIN
  const isReporter = task.reporterId._id.toString() === userId;
  const isProjectLead = project.leadId._id.toString() === userId;

  if (!isReporter && !isProjectLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Hanya pembuat task, Lead Project, atau ADMIN yang dapat menghapus task.', StatusCodes.FORBIDDEN);
  }

  await taskRepository.deleteTask(id);
  return { message: 'Task berhasil dihapus' };
};
