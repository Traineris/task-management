import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { loginLimiter, otpVerifyLimiter, otpSendLimiter } from '../middlewares/authLimiter';
import { authorizeRoles } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/verify-otp', otpVerifyLimiter, authController.verifyOtp);
router.post('/send-otp', otpSendLimiter, authController.sendOtp);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', otpSendLimiter, authController.forgotPassword);
router.post('/reset-password', otpVerifyLimiter, authController.resetPassword);
router.get('/me', authenticateToken, authController.getProfile);
router.patch('/profile', authenticateToken, authController.updateProfile);
router.patch('/change-password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Admin Only Routes
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), authController.getAllUsers);
router.patch('/users/:id/role', authenticateToken, authorizeRoles('ADMIN'), authController.updateUserRole);

export default router;
