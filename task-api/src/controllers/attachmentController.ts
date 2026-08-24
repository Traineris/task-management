import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import * as attachmentService from '../services/attachmentService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CustomError } from '../utils/customError';

export const getAttachments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const attachments = await attachmentService.getAttachments(taskId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar lampiran file berhasil diambil',
    data: attachments,
  });
});

export const createAttachment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  if (!req.file) {
    throw new CustomError('File lampiran wajib diunggah', StatusCodes.BAD_REQUEST);
  }

  const attachment = await attachmentService.createAttachment(taskId, userId, userRole, req.file);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Lampiran file berhasil diunggah',
    data: attachment,
  });
});

export const deleteAttachment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const attachmentId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await attachmentService.deleteAttachment(attachmentId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
