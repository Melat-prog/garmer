import { Router } from 'express';
import { createInquiry, getInquiries, getInquiryById, updateInquiryStatus } from '../controllers/inquiry.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // All inquiry routes require authentication

router.post('/', createInquiry);
router.get('/', getInquiries);
router.get('/:id', getInquiryById);
router.patch('/:id/status', updateInquiryStatus);

export default router;
