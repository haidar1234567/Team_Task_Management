import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  createdBy: IUser['_id'];
  members: IUser['_id'][];
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
