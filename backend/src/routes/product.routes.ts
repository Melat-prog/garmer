import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, isSupplier } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, isSupplier, createProduct);
router.put('/:id', authenticate, isSupplier, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
