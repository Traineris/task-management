import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import * as activityService from '../services/activityService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const activities = await activityService.getActivities(taskId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Riwayat aktivitas task berhasil diambil',
    data: activities,
  });
});
