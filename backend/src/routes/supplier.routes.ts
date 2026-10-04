import { Router } from 'express';
import { getSuppliers, getSupplierById } from '../controllers/supplier.controller';

const router = Router();

router.get('/', getSuppliers);
router.get('/:id', getSupplierById);

export default router;
