import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Customer } = db;
import { getPaginationOptions, getSearchQuery, getSortingOptions } from '../../utils/pagination';

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { limit, offset, page } = getPaginationOptions(req);
    const searchCondition = getSearchQuery(req, ['name', 'phone', 'email']);
    const order = getSortingOptions(req, 'created_at', 'DESC');
    
    // type filter
    const type = req.query.type as string;
    const phone = req.query.phone as string;
    const whereClause: any = { tenant_id: req.tenant?.id, ...searchCondition };
    if (type) {
      whereClause.type = type;
    }
    if (phone) {
      whereClause.phone = phone;
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: order as any
    });
    
    res.json({ 
      success: true, 
      message: 'Customers retrieved', 
      data: customers,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ 
      where: { id, tenant_id: req.tenant?.id }
    });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer retrieved', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, email, address, type, age, gender, discount_percent } = req.body;
    
    const existingCustomer = await Customer.findOne({ where: { phone, tenant_id: req.tenant?.id } });
    if (existingCustomer) {
      return res.status(400).json({ success: false, message: 'Customer with this phone already exists' });
    }

    const customer = await Customer.create({ 
      name, phone, email, address, type, age, gender, discount_percent: discount_percent || 0, tenant_id: req.tenant?.id 
    });
    res.status(201).json({ success: true, message: 'Customer created', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ where: { id, tenant_id: req.tenant?.id } });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.update({
      ...req.body,
      // Ensure we don't accidentally override with undefined if not passed
    });
    res.json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ where: { id, tenant_id: req.tenant?.id } });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getCustomerStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ where: { id, tenant_id: req.tenant?.id } });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { Sale } = db;
    
    const sales = await Sale.findAll({
      where: { customer_id: id, tenant_id: req.tenant?.id },
      order: [['created_at', 'DESC']]
    });

    const totalPurchases = sales.length;
    const totalSpent = sales.reduce((sum: number, sale: any) => sum + Number(sale.total_amount), 0);
    const lastPurchaseDate = sales.length > 0 ? sales[0].created_at : null;
    const loyaltyPoints = Math.floor(totalSpent / 100);
    const outstandingBalance = 0; // Using 0 for now as payments are not tracked separately

    res.json({ 
      success: true, 
      data: {
        outstandingBalance,
        totalPurchases,
        lastPurchaseDate,
        loyaltyPoints
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
