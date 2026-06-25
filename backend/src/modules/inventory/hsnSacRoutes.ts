import express from 'express';
import { getHsnSac, createHsnSac, updateHsnSac, deleteHsnSac } from './hsnSacController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getHsnSac);
router.post('/', createHsnSac);
router.put('/:id', updateHsnSac);
router.delete('/:id', deleteHsnSac);

export default router;
