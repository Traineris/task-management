import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import * as projectRepository from '../repositories/projectRepository';
import * as taskRepository from '../repositories/taskRepository';
import * as commentRepository from '../repositories/commentRepository';
import * as activityRepository from '../repositories/activityRepository';
import * as attachmentRepository from '../repositories/attachmentRepository';
import * as sprintRepository from '../repositories/sprintRepository';
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

  // 1. Ambil seluruh task di dalam project untuk membersihkan relasinya
  const projectTasks = await taskRepository.findTasksByProjectId(id);
  for (const task of projectTasks) {
    const taskId = task._id.toString();
    const attachments = await attachmentRepository.findAttachmentsByTaskId(taskId);
    for (const att of attachments) {
      const filePath = path.join(process.cwd(), 'uploads', path.basename(att.url));
      await fs.unlink(filePath).catch(() => null);
    }
    await Promise.all([
      attachmentRepository.deleteAttachmentsByTaskId(taskId),
      commentRepository.deleteCommentsByTaskId(taskId),
      activityRepository.deleteActivitiesByTaskId(taskId),
      taskRepository.deleteSubtasksByParentId(taskId),
    ]);
  }

  // 2. Hapus seluruh task, sprint, dan project
  await Promise.all([
    taskRepository.deleteTasksByProjectId(id),
    sprintRepository.deleteSprintsByProjectId(id),
    projectRepository.deleteProject(id),
  ]);

  return { message: 'Project dan seluruh data terkait berhasil dihapus' };
};
