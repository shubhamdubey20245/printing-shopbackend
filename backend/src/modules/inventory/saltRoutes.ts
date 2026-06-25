import express from 'express';
import { getSalts, createSalt, updateSalt, deleteSalt } from './saltController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getSalts);
router.post('/', createSalt);
router.put('/:id', updateSalt);
router.delete('/:id', deleteSalt);

export default router;
