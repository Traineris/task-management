import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  key: string;
  description?: string;
  leadId: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

export const ProjectModel = model<IProject>('Project', projectSchema);
