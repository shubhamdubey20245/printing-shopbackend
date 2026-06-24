import { Router } from 'express';
import { 
  getDoctors, 
  createDoctor, 
  updateDoctor,
  deleteDoctor
} from './doctorController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getDoctors);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;
