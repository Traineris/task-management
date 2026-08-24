import { Router } from 'express';
import * as sprintController from '../controllers/sprintController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken as any);

router.get('/', sprintController.getSprints);
router.post('/', sprintController.createSprint);
router.patch('/:id', sprintController.updateSprint);
router.delete('/:id', sprintController.deleteSprint);

export default router;
