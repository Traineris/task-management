import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Semua rute task wajib terautentikasi (Bearer Token)
router.use(authenticateToken as any);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.patch('/:id/reorder', taskController.reorderTask);
router.delete('/:id', taskController.deleteTask);

export default router;
