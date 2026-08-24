import { ActivityModel, IActivity } from '../models/activityModel';

const SENSITIVE_USER_FIELDS = '-password -otpCode -otpExpiresAt -tokenVersion -__v';

export const findActivitiesByTaskId = async (taskId: string): Promise<IActivity[]> => {
  return ActivityModel.find({ taskId })
    .populate('userId', SENSITIVE_USER_FIELDS)
    .sort({ createdAt: -1 });
};

export const createActivity = async (
  taskId: string,
  userId: string,
  action: string,
  details: string
): Promise<IActivity> => {
  return ActivityModel.create({
    taskId,
    userId,
    action,
    details,
  });
};
