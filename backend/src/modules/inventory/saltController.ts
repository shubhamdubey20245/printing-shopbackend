import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Salt } = db;

export const getSalts = async (req: AuthRequest, res: Response) => {
  try {
    const salts = await Salt.findAll({
      where: { tenant_id: req.tenant?.id },
      order: [['name', 'ASC']]
    });
    res.json({ success: true, message: 'Salts retrieved', data: salts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const createSalt = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const salt = await Salt.create({
      tenant_id: req.tenant?.id,
      name
    });
    res.status(201).json({ success: true, message: 'Salt created successfully', data: salt });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateSalt = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const salt = await Salt.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!salt) return res.status(404).json({ success: false, message: 'Salt not found' });

    await salt.update(req.body);
    res.json({ success: true, message: 'Salt updated successfully', data: salt });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const deleteSalt = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const salt = await Salt.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!salt) return res.status(404).json({ success: false, message: 'Salt not found' });

    await salt.destroy();
    res.json({ success: true, message: 'Salt deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};
