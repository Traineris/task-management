import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import * as taskRepository from '../repositories/taskRepository';
import * as projectRepository from '../repositories/projectRepository';
import * as commentRepository from '../repositories/commentRepository';
import * as activityRepository from '../repositories/activityRepository';
import * as attachmentRepository from '../repositories/attachmentRepository';
import * as notificationRepository from '../repositories/notificationRepository';
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

  const newTask = await taskRepository.createTask(userId, input, newPosition);

  // Notifikasi otomatis penugasan anggota
  if (input.assigneeId && input.assigneeId !== userId) {
    await notificationRepository.createNotification({
      userId: input.assigneeId,
      title: 'Penugasan Task Baru',
      message: `Anda telah ditugaskan pada task baru: "${newTask.title}"`,
      type: 'ASSIGNMENT',
      link: `/tasks/${newTask._id}`,
    }).catch(() => null);
  }

  return newTask;
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
  const updatedTask = await taskRepository.updateTask(id, input);

  // Notifikasi penugasan ulang
  const prevAssigneeId = (task.assigneeId as any)?._id?.toString() || (task.assigneeId as any)?.toString();
  if (input.assigneeId && input.assigneeId !== prevAssigneeId && input.assigneeId !== userId) {
    await notificationRepository.createNotification({
      userId: input.assigneeId,
      title: 'Penugasan Task',
      message: `Anda ditugaskan pada task "${task.title}"`,
      type: 'ASSIGNMENT',
      link: `/tasks/${id}`,
    }).catch(() => null);
  }

  // Notifikasi perpindahan status task
  if (input.status && input.status !== task.status) {
    const notifyRecipients = new Set<string>();
    const reporterId = (task.reporterId as any)?._id?.toString() || (task.reporterId as any)?.toString();
    if (prevAssigneeId && prevAssigneeId !== userId) notifyRecipients.add(prevAssigneeId);
    if (reporterId && reporterId !== userId) notifyRecipients.add(reporterId);

    for (const recipientId of notifyRecipients) {
      await notificationRepository.createNotification({
        userId: recipientId,
        title: 'Status Task Berubah',
        message: `Status task "${task.title}" diubah menjadi ${input.status}`,
        type: 'STATUS_CHANGE',
        link: `/tasks/${id}`,
      }).catch(() => null);
    }
  }

  return updatedTask;
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
  const reordered = await taskRepository.updateTaskPositionAndStatus(id, input.status, input.position);

  // Notifikasi saat status berpindah via drag & drop Kanban
  if (input.status && input.status !== task.status) {
    const notifyRecipients = new Set<string>();
    const assigneeId = (task.assigneeId as any)?._id?.toString() || (task.assigneeId as any)?.toString();
    const reporterId = (task.reporterId as any)?._id?.toString() || (task.reporterId as any)?.toString();
    if (assigneeId && assigneeId !== userId) notifyRecipients.add(assigneeId);
    if (reporterId && reporterId !== userId) notifyRecipients.add(reporterId);

    for (const recipientId of notifyRecipients) {
      await notificationRepository.createNotification({
        userId: recipientId,
        title: 'Status Task Berubah (Kanban)',
        message: `Task "${task.title}" dipindahkan ke kolom ${input.status}`,
        type: 'STATUS_CHANGE',
        link: `/tasks/${id}`,
      }).catch(() => null);
    }
  }

  return reordered;
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

  // 1. Ambil seluruh lampiran file terkait untuk dihapus fisiknya dari disk
  const attachments = await attachmentRepository.findAttachmentsByTaskId(id);
  for (const att of attachments) {
    const filePath = path.join(process.cwd(), 'uploads', path.basename(att.url));
    await fs.unlink(filePath).catch(() => null);
  }

  // 2. Bersihkan seluruh relasi (lampiran, komentar, aktivitas, subtask) dan task utama
  await Promise.all([
    attachmentRepository.deleteAttachmentsByTaskId(id),
    commentRepository.deleteCommentsByTaskId(id),
    activityRepository.deleteActivitiesByTaskId(id),
    taskRepository.deleteSubtasksByParentId(id),
    taskRepository.deleteTask(id),
  ]);

  return { message: 'Task dan seluruh data terkait berhasil dihapus' };
};
