import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { authLimiter } from '../middlewares/authLimiter';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/send-otp', authController.sendOtp);
router.post('/google', authController.googleAuth);
router.get('/me', authenticateToken, authController.getProfile);

export default router;
