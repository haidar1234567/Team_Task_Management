import express from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus 
} from '../controllers/taskController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);

router.route('/:id/status')
  .patch(protect, updateTaskStatus);

export default router;
