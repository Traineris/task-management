import { Schema, model, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  details: string;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activitySchema.index({ taskId: 1, createdAt: -1 });

export const ActivityModel = model<IActivity>('Activity', activitySchema);
