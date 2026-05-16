import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  assignedTo: IUser['_id'];
  project: IProject['_id'];
  createdBy: IUser['_id'];
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: { type: Date, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
