import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Sale, SaleItem, Medicine } = db;
import sequelize from '../../config/database';
import { Op } from 'sequelize';

export const getSalesReports = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.findAll({
      where: {
        tenant_id: req.tenant?.id,
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('created_at')), 'date'],
        [sequelize.fn('sum', sequelize.col('total_amount')), 'totalRevenue']
      ],
      group: [sequelize.fn('date', sequelize.col('created_at'))],
      order: [[sequelize.fn('date', sequelize.col('created_at')), 'ASC']]
    });

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getGstReports = async (req: AuthRequest, res: Response) => {
  try {
    // A simplified GST report aggregating from SaleItem
    const items = await SaleItem.findAll({
      include: [{ model: Sale, where: { tenant_id: req.tenant?.id }, attributes: [] }],
      attributes: [
        'gst_percentage',
        [sequelize.fn('sum', sequelize.col('total')), 'taxableAmount']
      ],
      group: ['gst_percentage'],
    });
    
    const formatted = items.map((i: any) => ({
      tax_rate: `${i.gst_percentage}%`,
      taxable_amount: Number(i.dataValues.taxableAmount),
      cgst: Number(i.dataValues.taxableAmount) * (i.gst_percentage / 2 / 100),
      sgst: Number(i.dataValues.taxableAmount) * (i.gst_percentage / 2 / 100),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getInventoryReports = async (req: AuthRequest, res: Response) => {
  try {
    const inventory = await Medicine.findAll({
      where: { tenant_id: req.tenant?.id },
      attributes: [
        'name', 'stock_quantity', 'mrp', 'selling_price', 'minimum_stock'
      ]
    });
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
