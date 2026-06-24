import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({ message: 'Forbidden: Tenant ID is required' });
  }

  // Inject req.tenant for controllers to use
  req.tenant = { id: req.user.tenant_id };

  // Inject tenant_id into req.body and req.query for easier access in controllers
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    req.body.tenant_id = req.user.tenant_id;
  }
  
  next();
};
