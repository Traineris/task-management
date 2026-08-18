import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createTaskSchema, updateTaskSchema, reorderTaskSchema } from '../validations/taskValidation';
import * as taskService from '../services/taskService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CustomError } from '../utils/customError';

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.query.projectId as string;
  if (!projectId) {
    throw new CustomError('Query parameter projectId wajib diisi', StatusCodes.BAD_REQUEST);
  }

  const userId = req.user!.id;
  const userRole = req.user!.role;
  const tasks = await taskService.getTasks(projectId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar task berhasil diambil',
    data: tasks,
  });
});

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const task = await taskService.getTaskById(taskId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Detail task berhasil diambil',
    data: task,
  });
});

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = createTaskSchema.parse(req.body);

  const task = await taskService.createTask(userId, userRole, validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Task baru berhasil dibuat',
    data: task,
  });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = updateTaskSchema.parse(req.body);

  const updatedTask = await taskService.updateTask(taskId, userId, userRole, validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Task berhasil diperbarui',
    data: updatedTask,
  });
});

export const reorderTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = reorderTaskSchema.parse(req.body);

  const reorderedTask = await taskService.reorderTask(taskId, userId, userRole, validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Posisi task berhasil diperbarui',
    data: reorderedTask,
  });
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await taskService.deleteTask(taskId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
