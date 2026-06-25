import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Medicine, Category, Company, Salt, HsnSac } = db;
import { getPaginationOptions, getSearchQuery, getSortingOptions } from '../../utils/pagination';

export const getMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const { limit, offset, page } = getPaginationOptions(req);
    const searchCondition = getSearchQuery(req, ['name', 'batch_number', 'packing', 'manufacturer']);
    const order = getSortingOptions(req, 'created_at', 'DESC');
    
    // category filter
    const category_id = req.query.category_id as string;
    const company_id = req.query.company_id as string;
    const whereClause: any = { tenant_id: req.tenant?.id, ...searchCondition };
    if (category_id && category_id !== 'All') {
      whereClause.category_id = category_id;
    }
    if (company_id && company_id !== 'All') {
      whereClause.company_id = company_id;
    }

    const { count, rows: medicines } = await Medicine.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, attributes: ['id', 'name', 'minimum_margin'] },
        { model: Company, attributes: ['id', 'name'] },
        { model: Salt, attributes: ['id', 'name'] },
        { model: HsnSac, attributes: ['id', 'hsn_code', 'sgst', 'cgst', 'igst', 'type', 'uqc'] }
      ],
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const getMedicineById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOne({ 
      where: { id, tenant_id: req.tenant?.id },
      include: [
        { model: Category, attributes: ['id', 'name', 'minimum_margin'] },
        { model: Company, attributes: ['id', 'name'] },
        { model: Salt, attributes: ['id', 'name'] },
        { model: HsnSac, attributes: ['id', 'hsn_code', 'sgst', 'cgst', 'igst', 'type', 'uqc'] }
      ]
    });
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, message: 'Medicine retrieved', data: medicine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.create({
      tenant_id: req.tenant?.id,
      ...req.body
    });
    
    const fetched = await Medicine.findOne({
      where: { id: medicine.id },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] },
        { model: Salt, attributes: ['id', 'name'] },
        { model: HsnSac, attributes: ['id', 'hsn_code'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Medicine created', data: fetched || medicine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
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

    const fetched = await Medicine.findOne({
      where: { id: medicine.id },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] },
        { model: Salt, attributes: ['id', 'name'] },
        { model: HsnSac, attributes: ['id', 'hsn_code'] }
      ]
    });

    res.json({ success: true, message: 'Medicine updated', data: fetched || medicine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};
