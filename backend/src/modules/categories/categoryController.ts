import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Category } = db;

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.findAll({
      where: { tenant_id: req.tenant?.id }
    });
    res.json({ success: true, message: 'Categories retrieved', data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, minimum_margin } = req.body;
    const category = await Category.create({
      tenant_id: req.tenant?.id,
      name,
      description,
      minimum_margin: minimum_margin ?? 0
    });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, minimum_margin } = req.body;
    const category = await Category.findOne({ where: { id, tenant_id: req.tenant?.id }});
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    
    await category.update({ name, description, minimum_margin: minimum_margin ?? category.minimum_margin ?? 0 });
    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id, tenant_id: req.tenant?.id }});
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    
    await category.destroy();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
