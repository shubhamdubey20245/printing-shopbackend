import { Router } from 'express';
import { getPurchases, createPurchase, receivePurchase } from './purchaseController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getPurchases);
router.post('/', createPurchase);
router.put('/:id/receive', receivePurchase);

export default router;
