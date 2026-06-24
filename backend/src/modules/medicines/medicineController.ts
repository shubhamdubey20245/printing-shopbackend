import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Medicine, Category } = db;
import { getPaginationOptions, getSearchQuery, getSortingOptions } from '../../utils/pagination';

export const getMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const { limit, offset, page } = getPaginationOptions(req);
    const searchCondition = getSearchQuery(req, ['name', 'batch_number']);
    const order = getSortingOptions(req, 'created_at', 'DESC');
    
    // category filter
    const category_id = req.query.category_id as string;
    const whereClause: any = { tenant_id: req.tenant?.id, ...searchCondition };
    if (category_id) {
      whereClause.category_id = category_id;
    }

    const { count, rows: medicines } = await Medicine.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      limit,
      offset,
      order: order as any
    });
    
    res.json({ 
      success: true, 
      message: 'Medicines retrieved', 
      data: medicines,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getMedicineById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOne({ 
      where: { id, tenant_id: req.tenant?.id },
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, message: 'Medicine retrieved', data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.create({
      tenant_id: req.tenant?.id,
      ...req.body
    });
    res.status(201).json({ success: true, message: 'Medicine created', data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOne({ where: { id, tenant_id: req.tenant?.id } });
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    await medicine.update(req.body);
    res.json({ success: true, message: 'Medicine updated', data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOne({ where: { id, tenant_id: req.tenant?.id } });
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    await medicine.destroy();
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
