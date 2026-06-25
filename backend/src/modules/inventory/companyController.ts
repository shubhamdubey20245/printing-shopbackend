import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Company } = db;

export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await Company.findAll({
      where: { tenant_id: req.tenant?.id },
      order: [['name', 'ASC']]
    });
    res.json({ success: true, message: 'Companies retrieved', data: companies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, order_form_pref, invoice_printing_pref, dump_days,
      expiry_receive_upto, minimum_margin, sales_tax, sales_tax_cess,
      purchase_tax, purchase_tax_cess
    } = req.body;

    const company = await Company.create({
      tenant_id: req.tenant?.id,
      name,
      order_form_pref: order_form_pref ?? 1,
      invoice_printing_pref: invoice_printing_pref ?? 1,
      dump_days: dump_days ?? 60,
      expiry_receive_upto: expiry_receive_upto ?? 90,
      minimum_margin: minimum_margin ?? 0,
      sales_tax: sales_tax ?? 0,
      sales_tax_cess: sales_tax_cess ?? 0,
      purchase_tax: purchase_tax ?? 0,
      purchase_tax_cess: purchase_tax_cess ?? 0
    });
    res.status(201).json({ success: true, message: 'Company created successfully', data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    await company.update(req.body);
    res.json({ success: true, message: 'Company updated successfully', data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const deleteCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ where: { id, tenant_id: req.tenant?.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    await company.destroy();
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};
