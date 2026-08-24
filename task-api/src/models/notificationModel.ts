import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'ASSIGNMENT' | 'COMMENT' | 'STATUS_CHANGE' | 'SYSTEM';

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['ASSIGNMENT', 'COMMENT', 'STATUS_CHANGE', 'SYSTEM'], default: 'SYSTEM' },
    link: { type: String, trim: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const NotificationModel = model<INotification>('Notification', notificationSchema);
