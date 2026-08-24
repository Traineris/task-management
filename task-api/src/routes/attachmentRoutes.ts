import { Router } from 'express';
import * as attachmentController from '../controllers/attachmentController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router({ mergeParams: true });

router.use(authenticateToken as any);

router.get('/', attachmentController.getAttachments);
router.post('/', upload.single('file'), attachmentController.createAttachment);
router.delete('/:id', attachmentController.deleteAttachment);

export default router;
