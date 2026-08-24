import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true });

router.use(authenticateToken as any);

router.get('/', commentController.getComments);
router.post('/', commentController.createComment);
router.delete('/:id', commentController.deleteComment);

export default router;
