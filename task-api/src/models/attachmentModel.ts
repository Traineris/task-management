import { Schema, model, Document, Types } from 'mongoose';

export interface IAttachment extends Document {
  taskId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

attachmentSchema.index({ taskId: 1, createdAt: -1 });

export const AttachmentModel = model<IAttachment>('Attachment', attachmentSchema);
