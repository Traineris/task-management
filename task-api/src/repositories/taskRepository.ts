import { TaskModel, ITask, TaskStatus } from '../models/taskModel';
import { CreateTaskInput, UpdateTaskInput } from '../validations/taskValidation';

const SENSITIVE_USER_FIELDS = '-password -otpCode -otpExpiresAt -tokenVersion -__v';

export const findTasksByProjectId = async (projectId: string, filter?: { sprintId?: string | null }): Promise<ITask[]> => {
  const query: any = { projectId };
  if (filter && filter.sprintId !== undefined) {
    query.sprintId = filter.sprintId;
  }

  return TaskModel.find(query)
    .populate('assigneeId', SENSITIVE_USER_FIELDS)
    .populate('reporterId', SENSITIVE_USER_FIELDS)
    .populate('sprintId', 'name status startDate endDate')
    .populate('parentTaskId', 'title status priority')
    .sort({ position: 1, createdAt: -1 });
};

export const findTaskById = async (id: string): Promise<ITask | null> => {
  return TaskModel.findById(id)
    .populate('assigneeId', SENSITIVE_USER_FIELDS)
    .populate('reporterId', SENSITIVE_USER_FIELDS)
    .populate('sprintId', 'name status startDate endDate')
    .populate('parentTaskId', 'title status priority')
    .populate('projectId');
};

export const findSubtasksByParentId = async (parentTaskId: string): Promise<ITask[]> => {
  return TaskModel.find({ parentTaskId })
    .populate('assigneeId', SENSITIVE_USER_FIELDS)
    .sort({ position: 1 });
};

export const getMaxPositionInStatus = async (projectId: string, status: TaskStatus): Promise<number> => {
  const lastTask = await TaskModel.findOne({ projectId, status }).sort({ position: -1 }).select('position');
  return lastTask ? lastTask.position : 0;
};

export const createTask = async (
  reporterId: string,
  data: CreateTaskInput,
  position: number
): Promise<ITask> => {
  const newTask = await TaskModel.create({
    ...data,
    reporterId,
    position,
  });

  return (await newTask.populate('assigneeId', SENSITIVE_USER_FIELDS)).populate('reporterId', SENSITIVE_USER_FIELDS);
};

export const updateTask = async (
  id: string,
  data: UpdateTaskInput
): Promise<ITask | null> => {
  return TaskModel.findByIdAndUpdate(id, data, { new: true })
    .populate('assigneeId', SENSITIVE_USER_FIELDS)
    .populate('reporterId', SENSITIVE_USER_FIELDS)
    .populate('sprintId', 'name status startDate endDate');
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  return TaskModel.findByIdAndDelete(id);
};

export const updateTaskPositionAndStatus = async (
  id: string,
  status: TaskStatus,
  position: number
): Promise<ITask | null> => {
  return TaskModel.findByIdAndUpdate(id, { status, position }, { new: true })
    .populate('assigneeId', SENSITIVE_USER_FIELDS)
    .populate('reporterId', SENSITIVE_USER_FIELDS);
};
