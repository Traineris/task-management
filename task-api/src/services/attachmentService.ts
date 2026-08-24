import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import * as attachmentRepository from '../repositories/attachmentRepository';
import * as taskRepository from '../repositories/taskRepository';
import * as activityRepository from '../repositories/activityRepository';
import * as projectRepository from '../repositories/projectRepository';
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

export const getAttachments = async (taskId: string, userId: string, userRole: string) => {
  await checkTaskAndProjectAccess(taskId, userId, userRole);
  return attachmentRepository.findAttachmentsByTaskId(taskId);
};

export const createAttachment = async (
  taskId: string,
  userId: string,
  userRole: string,
  file: Express.Multer.File
) => {
  await checkTaskAndProjectAccess(taskId, userId, userRole);

  const fileUrl = `/uploads/${file.filename}`;

  const attachment = await attachmentRepository.createAttachment({
    taskId,
    uploadedBy: userId,
    filename: file.originalname,
    url: fileUrl,
    fileType: file.mimetype,
    fileSize: file.size,
  });

  // Catat riwayat aktivitas otomatis
  await activityRepository.createActivity(
    taskId,
    userId,
    'ATTACHMENT_UPLOADED',
    `mengunggah lampiran baru: "${file.originalname}"`
  );

  return attachment;
};

export const deleteAttachment = async (id: string, userId: string, userRole: string) => {
  const attachment = await attachmentRepository.findAttachmentById(id);
  if (!attachment) {
    throw new CustomError('Lampiran file tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const { project } = await checkTaskAndProjectAccess(attachment.taskId.toString(), userId, userRole);

  // Otorisasi: Hapus hanya boleh oleh pengunggah file, Lead Project, atau ADMIN
  const isUploader = attachment.uploadedBy._id.toString() === userId;
  const isLead = project.leadId._id.toString() === userId;

  if (!isUploader && !isLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Hanya pengunggah lampiran, Lead Project, atau ADMIN yang dapat menghapus lampiran.', StatusCodes.FORBIDDEN);
  }

  // Hapus file fisik dari direktori uploads
  const filePath = path.join(process.cwd(), 'uploads', path.basename(attachment.url));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await attachmentRepository.deleteAttachment(id);
  return { message: 'Lampiran file berhasil dihapus' };
};
