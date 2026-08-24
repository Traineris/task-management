import { SprintModel, ISprint } from '../models/sprintModel';
import { CreateSprintInput, UpdateSprintInput } from '../validations/sprintValidation';

export const findSprintsByProjectId = async (projectId: string): Promise<ISprint[]> => {
  return SprintModel.find({ projectId }).sort({ createdAt: -1 });
};

export const findSprintById = async (id: string): Promise<ISprint | null> => {
  return SprintModel.findById(id);
};

export const findActiveSprintByProjectId = async (projectId: string): Promise<ISprint | null> => {
  return SprintModel.findOne({ projectId, status: 'ACTIVE' });
};

export const createSprint = async (data: CreateSprintInput): Promise<ISprint> => {
  return SprintModel.create(data);
};

export const updateSprint = async (id: string, data: UpdateSprintInput): Promise<ISprint | null> => {
  return SprintModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSprint = async (id: string): Promise<ISprint | null> => {
  return SprintModel.findByIdAndDelete(id);
};
