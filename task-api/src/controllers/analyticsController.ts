import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import * as analyticsService from '../services/analyticsService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getProjectAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.params.projectId as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const analytics = await analyticsService.getProjectAnalytics(projectId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Data analitik project berhasil diambil',
    data: analytics,
  });
});
