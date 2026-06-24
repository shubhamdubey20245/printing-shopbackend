import { Router } from 'express';
import { 
  getMedicines, 
  createMedicine, 
  getMedicineById, 
  updateMedicine, 
  deleteMedicine 
} from './medicineController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;
