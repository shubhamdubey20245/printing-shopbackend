import express from 'express';
import { getCompanies, createCompany, updateCompany, deleteCompany } from './companyController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;
