import { Schema, model, Document, Types } from 'mongoose';

export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export interface ISprint extends Document {
  projectId: Types.ObjectId;
  name: string;
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  status: SprintStatus;
  createdAt: Date;
  updatedAt: Date;
}

const sprintSchema = new Schema<ISprint>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    goal: { type: String, trim: true },
    status: { type: String, enum: ['PLANNED', 'ACTIVE', 'COMPLETED'], default: 'PLANNED' },
  },
  {
    timestamps: true,
  }
);

sprintSchema.index({ projectId: 1, status: 1 });

export const SprintModel = model<ISprint>('Sprint', sprintSchema);
