import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import * as notificationService from '../services/notificationService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await notificationService.getNotifications(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar notifikasi berhasil diambil',
    data: result,
  });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id as string;
  const userId = req.user!.id;

  const notification = await notificationService.markNotificationAsRead(notificationId, userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Notifikasi berhasil ditandai sebagai dibaca',
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await notificationService.markAllNotificationsAsRead(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
