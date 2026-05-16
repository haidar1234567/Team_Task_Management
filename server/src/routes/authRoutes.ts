import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

export default router;
