import { StatusCodes } from 'http-status-codes';
import * as activityRepository from '../repositories/activityRepository';
import * as taskRepository from '../repositories/taskRepository';
import * as projectRepository from '../repositories/projectRepository';
import { CustomError } from '../utils/customError';

export const getActivities = async (taskId: string, userId: string, userRole: string) => {
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

  return activityRepository.findActivitiesByTaskId(taskId);
};
