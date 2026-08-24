import { StatusCodes } from 'http-status-codes';
import * as commentRepository from '../repositories/commentRepository';
import * as taskRepository from '../repositories/taskRepository';
import * as activityRepository from '../repositories/activityRepository';
import * as projectRepository from '../repositories/projectRepository';
import { CreateCommentInput } from '../validations/commentValidation';
import { CustomError } from '../utils/customError';

const checkTaskAndProjectAccess = async (taskId: string, userId: string, userRole: string) => {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) {
    throw new CustomError('Task tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const project = await projectRepository.findProjectById(task.projectId._id.toString());
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const isMemberOrLead =
    project.leadId._id.toString() === userId ||
    project.members.some((member: any) => member._id.toString() === userId);

  if (!isMemberOrLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Anda bukan anggota dari project ini.', StatusCodes.FORBIDDEN);
  }

  return { task, project };
};

export const getComments = async (taskId: string, userId: string, userRole: string) => {
  await checkTaskAndProjectAccess(taskId, userId, userRole);
  return commentRepository.findCommentsByTaskId(taskId);
};

export const createComment = async (
  taskId: string,
  userId: string,
  userRole: string,
  input: CreateCommentInput
) => {
  await checkTaskAndProjectAccess(taskId, userId, userRole);

  const comment = await commentRepository.createComment(taskId, userId, input.content);

  // Catat riwayat aktivitas otomatis
  await activityRepository.createActivity(
    taskId,
    userId,
    'COMMENTED',
    `menambahkan komentar baru: "${input.content.slice(0, 50)}${input.content.length > 50 ? '...' : ''}"`
  );

  return comment;
};

export const deleteComment = async (id: string, userId: string, userRole: string) => {
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    throw new CustomError('Komentar tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const { project } = await checkTaskAndProjectAccess(comment.taskId.toString(), userId, userRole);

  // Otorisasi: Hapus hanya boleh oleh pembuat komentar, Lead Project, atau ADMIN
  const isOwner = comment.userId._id.toString() === userId;
  const isLead = project.leadId._id.toString() === userId;

  if (!isOwner && !isLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Hanya pembuat komentar, Lead Project, atau ADMIN yang dapat menghapus komentar.', StatusCodes.FORBIDDEN);
  }

  await commentRepository.deleteComment(id);
  return { message: 'Komentar berhasil dihapus' };
};
