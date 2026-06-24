import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Sale, SaleItem, Medicine, Customer } = db;
import { Op } from 'sequelize';
import sequelize from '../../config/database';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's Sales
    const todaysSales = await Sale.sum('total_amount', {
      where: {
        tenant_id: req.tenant?.id,
        created_at: { [Op.gte]: today }
      }
    }) || 0;

    // Monthly Revenue
    const monthlyRevenue = await Sale.sum('total_amount', {
      where: {
        tenant_id: req.tenant?.id,
        created_at: { [Op.gte]: firstDayOfMonth }
      }
    }) || 0;

    // Pending Payments (Mock logic - assuming any sale without CASH/CARD is pending)
    const pendingPayments = await Sale.sum('total_amount', {
      where: {
        tenant_id: req.tenant?.id,
        payment_method: 'CREDIT'
      }
    }) || 0;

    res.json({
      success: true,
      data: {
        todaysSales,
        monthlyRevenue,
        pendingPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getExpiringMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const medicines = await Medicine.findAll({
      where: {
        tenant_id: req.tenant?.id,
        expiry_date: { [Op.lte]: nextMonth }
      },
      order: [['expiry_date', 'ASC']],
      limit: 10
    });
    res.json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getRecentBills = async (req: AuthRequest, res: Response) => {
  try {
    const bills = await Sale.findAll({
      where: { tenant_id: req.tenant?.id },
      include: [{ model: Customer, attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getTopSelling = async (req: AuthRequest, res: Response) => {
  try {
    // Step 1: Get top medicine_ids by total quantity sold, scoped to tenant via Sale join
    const tenantSaleIds = await Sale.findAll({
      where: { tenant_id: req.tenant?.id },
      attributes: ['id'],
      raw: true
    });

    const saleIdList = tenantSaleIds.map((s: any) => s.id);

    if (saleIdList.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const items = await SaleItem.findAll({
      where: { sale_id: saleIdList },
      attributes: [
        'medicine_id',
        [sequelize.fn('sum', sequelize.col('SaleItem.quantity')), 'totalSold']
      ],
      group: ['medicine_id'],
      order: [[sequelize.fn('sum', sequelize.col('SaleItem.quantity')), 'DESC']],
      limit: 5,
      raw: true
    });

    // Step 2: Fetch medicine names
    const medicineIds = items.map((i: any) => i.medicine_id);
    const medicines = await Medicine.findAll({
      where: { id: medicineIds },
      attributes: ['id', 'name', 'stock_quantity']
    });
    const medMap: any = {};
    medicines.forEach((m: any) => { medMap[m.id] = m; });

    const result = items.map((item: any) => ({
      medicine_id: item.medicine_id,
      totalSold: item.totalSold,
      Medicine: medMap[item.medicine_id] || null
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

