import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { HsnSac } = db;

export const getHsnSac = async (req: AuthRequest, res: Response) => {
  try {
    const list = await HsnSac.findAll({
      where: { tenant_id: req.tenant?.id },
      order: [['hsn_code', 'ASC']]
    });
    res.json({ success: true, message: 'HSN/SAC retrieved', data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const createHsnSac = async (req: AuthRequest, res: Response) => {
  try {
    const { hsn_code, short_name, sgst, cgst, igst, type, uqc, cess } = req.body;
    const hsn = await HsnSac.create({
      tenant_id: req.tenant?.id,
      hsn_code,
      short_name,
      sgst: sgst ?? 0,
      cgst: cgst ?? 0,
      igst: igst ?? 0,
      type: type ?? 'Goods',
      uqc,
      cess: cess ?? 0
    });
    res.status(201).json({ success: true, message: 'HSN/SAC created successfully', data: hsn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateHsnSac = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const hsn = await HsnSac.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!hsn) return res.status(404).json({ success: false, message: 'HSN/SAC not found' });

    await hsn.update(req.body);
    res.json({ success: true, message: 'HSN/SAC updated successfully', data: hsn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const deleteHsnSac = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const hsn = await HsnSac.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!hsn) return res.status(404).json({ success: false, message: 'HSN/SAC not found' });

    await hsn.destroy();
    res.json({ success: true, message: 'HSN/SAC deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};
