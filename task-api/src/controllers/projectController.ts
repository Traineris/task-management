import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createProjectSchema, updateProjectSchema } from '../validations/projectValidation';
import * as projectService from '../services/projectService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projects = await projectService.getProjects(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Daftar project berhasil diambil',
    data: projects,
  });
});

export const getProjectById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const project = await projectService.getProjectById(projectId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Detail project berhasil diambil',
    data: project,
  });
});

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const validatedData = createProjectSchema.parse(req.body);

  const project = await projectService.createProject(userId, validatedData);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Project baru berhasil dibuat',
    data: project,
  });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validatedData = updateProjectSchema.parse(req.body);

  const updatedProject = await projectService.updateProject(projectId, userId, userRole, validatedData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Project berhasil diperbarui',
    data: updatedProject,
  });
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectId = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await projectService.deleteProject(projectId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
});
