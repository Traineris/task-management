import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: Types.ObjectId;
  reporterId: Types.ObjectId;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'HIGHEST'], default: 'MEDIUM' },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: Number, default: 65535 },
  },
  {
    timestamps: true,
  }
);

// Indexing untuk kecepatan pencarian Kanban Board berdasarkan Project & Status
taskSchema.index({ projectId: 1, status: 1, position: 1 });

export const TaskModel = model<ITask>('Task', taskSchema);
