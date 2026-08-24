import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { TaskModel } from '../models/taskModel';
import { SprintModel } from '../models/sprintModel';
import * as projectRepository from '../repositories/projectRepository';
import { CustomError } from '../utils/customError';

export const getProjectAnalytics = async (projectId: string, userId: string, userRole: string) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new CustomError('Project tidak ditemukan', StatusCodes.NOT_FOUND);
  }

  const isMemberOrLead =
    project.leadId._id.toString() === userId ||
    project.members.some((member: any) => member._id.toString() === userId);

  if (!isMemberOrLead && userRole !== 'ADMIN') {
    throw new CustomError('Akses ditolak. Anda bukan anggota dari project ini.', StatusCodes.FORBIDDEN);
  }

  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  // 1. Task Statistics Aggregation
  const statusStats = await TaskModel.aggregate([
    { $match: { projectId: projectObjectId } },
    { $group: { _id: '$status', count: { $sum: 1 }, totalStoryPoints: { $sum: { $ifNull: ['$storyPoints', 0] } } } },
  ]);

  const priorityStats = await TaskModel.aggregate([
    { $match: { projectId: projectObjectId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  const issueTypeStats = await TaskModel.aggregate([
    { $match: { projectId: projectObjectId } },
    { $group: { _id: '$issueType', count: { $sum: 1 } } },
  ]);

  const totalTasks = await TaskModel.countDocuments({ projectId });
  const completedTasks = await TaskModel.countDocuments({ projectId, status: 'DONE' });
  const inProgressTasks = await TaskModel.countDocuments({ projectId, status: 'IN_PROGRESS' });
  const todoTasks = await TaskModel.countDocuments({ projectId, status: 'TODO' });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 2. Active Sprint Info
  const activeSprint = await SprintModel.findOne({ projectId, status: 'ACTIVE' });
  let activeSprintMetrics = null;

  if (activeSprint) {
    const sprintTotalTasks = await TaskModel.countDocuments({ sprintId: activeSprint._id });
    const sprintCompletedTasks = await TaskModel.countDocuments({ sprintId: activeSprint._id, status: 'DONE' });
    const sprintStoryPoints = await TaskModel.aggregate([
      { $match: { sprintId: activeSprint._id } },
      { $group: { _id: null, totalPoints: { $sum: { $ifNull: ['$storyPoints', 0] } } } },
    ]);

    activeSprintMetrics = {
      id: activeSprint._id,
      name: activeSprint.name,
      startDate: activeSprint.startDate,
      endDate: activeSprint.endDate,
      goal: activeSprint.goal,
      totalTasks: sprintTotalTasks,
      completedTasks: sprintCompletedTasks,
      totalStoryPoints: sprintStoryPoints[0]?.totalPoints || 0,
      completionRate: sprintTotalTasks > 0 ? Math.round((sprintCompletedTasks / sprintTotalTasks) * 100) : 0,
    };
  }

  return {
    overview: {
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      completionRate,
      totalMembers: project.members.length,
    },
    statusDistribution: statusStats.reduce((acc: any, curr) => ({ ...acc, [curr._id]: curr.count }), { TODO: 0, IN_PROGRESS: 0, DONE: 0 }),
    priorityDistribution: priorityStats.reduce((acc: any, curr) => ({ ...acc, [curr._id]: curr.count }), { LOW: 0, MEDIUM: 0, HIGH: 0, HIGHEST: 0 }),
    issueTypeDistribution: issueTypeStats.reduce((acc: any, curr) => ({ ...acc, [curr._id]: curr.count }), { STORY: 0, TASK: 0, BUG: 0, EPIC: 0 }),
    activeSprint: activeSprintMetrics,
  };
};
