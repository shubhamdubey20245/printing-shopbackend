import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Supplier } = db;

export const getSuppliers = async (req: AuthRequest, res: Response) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { tenant_id: req.tenant?.id }
    });
    res.json({ success: true, message: 'Suppliers retrieved', data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const { name, contact_person, phone, email, address } = req.body;
    const supplier = await Supplier.create({
      tenant_id: req.tenant?.id,
      name,
      contact_person,
      phone,
      email,
      address
    });
    res.status(201).json({ success: true, message: 'Supplier created', data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, email, address } = req.body;
    const supplier = await Supplier.findOne({ where: { id, tenant_id: req.tenant?.id }});
    if (!supplier) return res.status(404).json({ success: false, message: 'Not found' });
    
    await supplier.update({ name, contact_person, phone, email, address });
    res.json({ success: true, message: 'Supplier updated', data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOne({ where: { id, tenant_id: req.tenant?.id }});
    if (!supplier) return res.status(404).json({ success: false, message: 'Not found' });
    
    await supplier.destroy();
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
