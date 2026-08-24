import { Router } from 'express';
import * as activityController from '../controllers/activityController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true });

router.use(authenticateToken as any);

router.get('/', activityController.getActivities);

export default router;
