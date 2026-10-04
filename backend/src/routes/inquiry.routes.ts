import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  forwardInquiryToSupplier,
  rejectInquiryByAdmin,
  submitSupplierQuotation,
  approveAndReleaseQuotation,
  acceptQuotation,
  rejectQuotation
} from '../controllers/inquiry.controller';
import { authenticate, isBuyer, isSupplier, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate); // All inquiry routes require authentication

router.post('/', isBuyer, createInquiry);
router.get('/', getInquiries);
router.get('/:id', getInquiryById);

// Admin workflow routes
router.post('/:id/forward', isAdmin, forwardInquiryToSupplier);
router.post('/:id/admin-reject', isAdmin, rejectInquiryByAdmin);
router.post('/:id/approve-quotation', isAdmin, approveAndReleaseQuotation);

// Supplier workflow routes
router.post('/:id/quotation', isSupplier, submitSupplierQuotation);

// Buyer response routes
router.post('/:id/accept', isBuyer, acceptQuotation);
router.post('/:id/reject', isBuyer, rejectQuotation);

export default router;
