import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createSprintSchema, updateSprintSchema } from '../validations/sprintValidation';
import * as sprintService from '../services/sprintService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CustomError } from '../utils/customError';

export const getSprints = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.query.projectId as string;
  if (!projectId) {
    throw new CustomError('Query parameter projectId wajib diisi', StatusCodes.BAD_REQUEST);
  }

  const userId = req.user!.id;
  const userRole = req.user!.role;
  const sprints = await sprintService.getSprints(projectId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar sprint berhasil diambil',
    data: sprints,
  });
});

export const createSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = createSprintSchema.parse(req.body);

  const sprint = await sprintService.createSprint(userId, userRole, validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Sprint berhasil dibuat',
    data: sprint,
  });
});

export const updateSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sprintId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = updateSprintSchema.parse(req.body);

  const updatedSprint = await sprintService.updateSprint(sprintId, userId, userRole, validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Sprint berhasil diperbarui',
    data: updatedSprint,
  });
});

export const deleteSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sprintId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await sprintService.deleteSprint(sprintId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
