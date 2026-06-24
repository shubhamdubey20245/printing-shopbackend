import { Router } from 'express';
import { getMedicinePurchaseHistory, getMedicineBatches } from './inventoryController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/medicine/:medicineId/purchase-history', getMedicinePurchaseHistory);
router.get('/medicine/:medicineId/batches', getMedicineBatches);

export default router;
