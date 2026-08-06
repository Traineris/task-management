import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  dates: Date;
  code: string;
  description?: string;
  // ownerId: mongoose.Types.ObjectId; // Nanti di-uncomment setelah model User selesai
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    dates: { type: Date, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    // ownerId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true },
);

export default mongoose.model<IBoard>("Boards", BoardSchema);
