import { Router } from 'express';
import { getMedicinePricing, getCustomerHistory, getMedicineTimeline } from './analyticsController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/medicine/:medicineId/pricing', getMedicinePricing);
router.get('/medicine/:medicineId/customer-history', getCustomerHistory);
router.get('/medicine/:medicineId/timeline', getMedicineTimeline);

export default router;
