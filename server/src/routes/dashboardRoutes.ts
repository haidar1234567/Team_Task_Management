import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/stats')
  .get(protect, getDashboardStats);

export default router;
