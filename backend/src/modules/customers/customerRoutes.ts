import { Router } from 'express';
import { 
  getCustomers, 
  createCustomer, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomer,
  getCustomerStats
} from './customerController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getCustomers);
router.get('/:id/stats', getCustomerStats);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
