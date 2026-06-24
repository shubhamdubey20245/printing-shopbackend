import { Router } from 'express';
import { createSale, getSales, getSaleById, getAnalytics, processReturn, updateSale, getMedicineSalesHistory } from './billingController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/analytics/today', getAnalytics);
router.get('/sales', getSales);
router.get('/sales/:id', getSaleById);
router.post('/sale', createSale);
router.put('/sale/:id', updateSale);
router.post('/sale/:id/return', processReturn);
router.get('/medicine/:medicineId/history', getMedicineSalesHistory);

export default router;
