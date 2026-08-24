import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true });

router.use(authenticateToken as any);

router.get('/', analyticsController.getProjectAnalytics);

export default router;
