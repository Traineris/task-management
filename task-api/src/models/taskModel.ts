import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';
export type IssueType = 'STORY' | 'TASK' | 'BUG' | 'EPIC';

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  issueType: IssueType;
  storyPoints?: number;
  sprintId?: Types.ObjectId;
  parentTaskId?: Types.ObjectId;
  assigneeId?: Types.ObjectId;
  reporterId: Types.ObjectId;
  position: number;
  dueDate?: Date;
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
    issueType: { type: String, enum: ['STORY', 'TASK', 'BUG', 'EPIC'], default: 'TASK' },
    storyPoints: { type: Number, min: 0 },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint' },
    parentTaskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: Number, default: 65535 },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexing untuk kecepatan pencarian Kanban Board & Sprint
taskSchema.index({ projectId: 1, status: 1, position: 1 });
taskSchema.index({ projectId: 1, sprintId: 1 });

export const TaskModel = model<ITask>('Task', taskSchema);
