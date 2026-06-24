import { Router } from 'express';
import { getStoreProfile, updateStoreProfile } from './settingsController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/store-profile', getStoreProfile);
router.post('/store-profile', updateStoreProfile);

export default router;
