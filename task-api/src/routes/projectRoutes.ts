import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Semua rute project wajib terautentikasi (Bearer Token)
router.use(authenticateToken as any);

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
