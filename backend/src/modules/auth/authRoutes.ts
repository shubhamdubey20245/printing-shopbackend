import { Router } from 'express';
import { registerTenant, login } from './authController';

const router = Router();

router.post('/register-tenant', registerTenant);
router.post('/login', login);

export default router;
