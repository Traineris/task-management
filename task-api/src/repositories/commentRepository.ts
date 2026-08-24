import { CommentModel, IComment } from '../models/commentModel';

const SENSITIVE_USER_FIELDS = '-password -otpCode -otpExpiresAt -tokenVersion -__v';

export const findCommentsByTaskId = async (taskId: string): Promise<IComment[]> => {
  return CommentModel.find({ taskId })
    .populate('userId', SENSITIVE_USER_FIELDS)
    .sort({ createdAt: 1 });
};

export const findCommentById = async (id: string): Promise<IComment | null> => {
  return CommentModel.findById(id).populate('userId', SENSITIVE_USER_FIELDS);
};

export const createComment = async (
  taskId: string,
  userId: string,
  content: string
): Promise<IComment> => {
  const comment = await CommentModel.create({
    taskId,
    userId,
    content,
  });

  return comment.populate('userId', SENSITIVE_USER_FIELDS);
};

export const deleteComment = async (id: string): Promise<IComment | null> => {
  return CommentModel.findByIdAndDelete(id);
};
