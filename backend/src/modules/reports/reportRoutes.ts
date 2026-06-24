import { Router } from 'express';
import { getSalesReports, getGstReports, getInventoryReports } from './reportController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/sales', getSalesReports);
router.get('/gst', getGstReports);
router.get('/inventory', getInventoryReports);

export default router;
