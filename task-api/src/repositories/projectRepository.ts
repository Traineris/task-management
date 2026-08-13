import { ProjectModel, IProject } from '../models/projectModel';
import { CreateProjectInput, UpdateProjectInput } from '../validations/projectValidation';

const SENSITIVE_USER_FIELDS = '-password -otpCode -otpExpiresAt -tokenVersion -__v';

export const findProjectsByUser = async (userId: string): Promise<IProject[]> => {
  return ProjectModel.find({
    $or: [{ leadId: userId }, { members: userId }],
  })
    .populate('leadId', SENSITIVE_USER_FIELDS)
    .populate('members', SENSITIVE_USER_FIELDS)
    .sort({ updatedAt: -1 });
};

export const findProjectById = async (id: string): Promise<IProject | null> => {
  return ProjectModel.findById(id)
    .populate('leadId', SENSITIVE_USER_FIELDS)
    .populate('members', SENSITIVE_USER_FIELDS);
};

export const findProjectByKey = async (key: string): Promise<IProject | null> => {
  return ProjectModel.findOne({ key: key.toUpperCase().trim() });
};

export const createProject = async (
  leadId: string,
  data: CreateProjectInput
): Promise<IProject> => {
  const members = data.members || [];
  if (!members.includes(leadId)) {
    members.push(leadId);
  }

  const newProject = await ProjectModel.create({
    ...data,
    key: data.key.toUpperCase().trim(),
    leadId,
    members,
  });

  return (await newProject.populate('leadId', SENSITIVE_USER_FIELDS)).populate('members', SENSITIVE_USER_FIELDS);
};

export const updateProject = async (
  id: string,
  data: UpdateProjectInput
): Promise<IProject | null> => {
  return ProjectModel.findByIdAndUpdate(id, data, { new: true })
    .populate('leadId', SENSITIVE_USER_FIELDS)
    .populate('members', SENSITIVE_USER_FIELDS);
};

export const deleteProject = async (id: string): Promise<IProject | null> => {
  return ProjectModel.findByIdAndDelete(id);
};
