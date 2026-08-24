import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createCommentSchema } from '../validations/commentValidation';
import * as commentService from '../services/commentService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const comments = await commentService.getComments(taskId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar komentar berhasil diambil',
    data: comments,
  });
});

export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = createCommentSchema.parse(req.body);

  const comment = await commentService.createComment(taskId, userId, userRole, validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Komentar berhasil ditambahkan',
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const commentId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await commentService.deleteComment(commentId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
