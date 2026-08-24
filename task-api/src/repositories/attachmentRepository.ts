import { AttachmentModel, IAttachment } from '../models/attachmentModel';

const SENSITIVE_USER_FIELDS = '-password -otpCode -otpExpiresAt -tokenVersion -__v';

export const findAttachmentsByTaskId = async (taskId: string): Promise<IAttachment[]> => {
  return AttachmentModel.find({ taskId })
    .populate('uploadedBy', SENSITIVE_USER_FIELDS)
    .sort({ createdAt: -1 });
};

export const findAttachmentById = async (id: string): Promise<IAttachment | null> => {
  return AttachmentModel.findById(id).populate('uploadedBy', SENSITIVE_USER_FIELDS);
};

export const createAttachment = async (data: {
  taskId: string;
  uploadedBy: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
}): Promise<IAttachment> => {
  const attachment = await AttachmentModel.create(data);
  return attachment.populate('uploadedBy', SENSITIVE_USER_FIELDS);
};

export const deleteAttachment = async (id: string): Promise<IAttachment | null> => {
  return AttachmentModel.findByIdAndDelete(id);
};
