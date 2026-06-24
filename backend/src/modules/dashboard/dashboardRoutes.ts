import { Router } from 'express';
import { getStats, getExpiringMedicines, getRecentBills, getTopSelling } from './dashboardController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/stats', getStats);
router.get('/expiring-medicines', getExpiringMedicines);
router.get('/recent-bills', getRecentBills);
router.get('/top-selling', getTopSelling);

export default router;
