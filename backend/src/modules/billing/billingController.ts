import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Sale, SaleItem, Medicine, InventoryTransaction } = db;
import sequelize from '../../config/database';

export const createSale = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { 
      customer_name, customer_phone, payment_method, items, discount = 0, additional_charges = 0, billing_date,
      patient_age, patient_gender, patient_address,
      doctor_name, doctor_reg_no, prescription_no, prescription_date, prescription_image_url, notes,
      amount_received, status = 'COMPLETED'
    } = req.body;
    
    // Calculate totals
    let subtotal = 0;
    let totalGst = 0;

    if (!items || items.length === 0) {
      throw new Error('No items provided');
    }

    for (const item of items) {
      subtotal += Number(item.price) * Number(item.quantity);
      totalGst += (Number(item.price) * Number(item.quantity)) * (Number(item.gst) / 100);
    }

    // Generate unique invoice number
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Use Sequelize Op from db
    const Op = db.Sequelize.Op;
    
    // Find highest invoice number for today to increment
    const lastSale = await Sale.findOne({
      where: {
        invoice_number: {
          [Op.like]: `INV-${dateStr}-%`
        }
      },
      order: [['created_at', 'DESC']],
      transaction: t
    });

    let sequence = 1;
    if (lastSale && lastSale.invoice_number) {
      const parts = lastSale.invoice_number.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2], 10) + 1;
      }
    }
    const invoice_number = `INV-${dateStr}-${String(sequence).padStart(4, '0')}`;

    const sale = await Sale.create({
      tenant_id: req.tenant?.id,
      invoice_number,
      customer_name: customer_name || 'Walk-in Customer',
      customer_phone: customer_phone || null,
      payment_method: payment_method || 'CASH',
      status: status,
      subtotal,
      gst_amount: totalGst,
      discount: discount,
      additional_charges: additional_charges,
      total_amount: subtotal + totalGst - discount + Number(additional_charges),
      amount_received: amount_received || (subtotal + totalGst - discount + Number(additional_charges)),
      balance_amount: (subtotal + totalGst - discount + Number(additional_charges)) - (amount_received || (subtotal + totalGst - discount + Number(additional_charges))),
      created_by: req.user?.id,
      billing_date: billing_date ? new Date(billing_date) : new Date(),
      patient_age,
      patient_gender,
      patient_address,
      doctor_name,
      doctor_reg_no,
      prescription_no,
      prescription_date: prescription_date ? new Date(prescription_date) : null,
      prescription_image_url,
      notes
    }, { transaction: t });

    // Handle items
    for (const item of items) {
      let finalMedicineId = item.medicine_id;
      let purchasePrice = 0;

      if (item.isExternal) {
        // Auto-create missing external medicine in catalog
        const newMed = await Medicine.create({
          tenant_id: req.tenant?.id,
          name: item.name || 'Unknown External Item',
          batch_number: item.batch || `EXT-${Date.now()}`,
          purchase_price: item.price,
          selling_price: item.price,
          mrp: item.mrp || item.price,
          gst_percentage: item.gst || 0,
          stock_quantity: 0,
          minimum_stock: 0,
          expiry_date: item.expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        }, { transaction: t });
        finalMedicineId = newMed.id;
        purchasePrice = Number(item.price);
      } else {
        const med = await Medicine.findOne({ where: { id: finalMedicineId }, transaction: t });
        purchasePrice = med ? Number(med.purchase_price) : 0;
      }

      // Pro-rata discount
      let discountRatio = 0;
      if (subtotal > 0 && discount > 0) {
        discountRatio = discount / subtotal;
      }
      const itemSubtotal = Number(item.price) * Number(item.quantity);
      const itemDiscount = itemSubtotal * discountRatio;
      const unitDiscount = Number(item.quantity) > 0 ? itemDiscount / Number(item.quantity) : 0;
      const profitPerUnit = Number(item.price) - purchasePrice - unitDiscount;

      await SaleItem.create({
        sale_id: sale.id,
        medicine_id: finalMedicineId,
        quantity: item.quantity,
        price: item.price,
        gst: item.gst,
        total: item.total,
        purchase_price_snapshot: purchasePrice,
        discount_snapshot: unitDiscount,
        profit_snapshot: profitPerUnit
      }, { transaction: t });

      // Update Inventory only if COMPLETED
      if (status === 'COMPLETED') {
        const medicine = await Medicine.findOne({ where: { id: finalMedicineId }, transaction: t });
        if (medicine) {
          await medicine.update({ stock_quantity: medicine.stock_quantity - item.quantity }, { transaction: t });

          // Log transaction
          await InventoryTransaction.create({
            tenant_id: req.tenant?.id,
            medicine_id: finalMedicineId,
            transaction_type: 'OUT',
            quantity: item.quantity,
            reference_id: sale.id,
            created_by: req.user?.id
          }, { transaction: t });
        }
      }
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Sale completed', data: sale });
  } catch (error: any) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const whereClause: any = { tenant_id: req.tenant?.id };
    if (status) {
      whereClause.status = status;
    }

    const sales = await Sale.findAll({
      where: whereClause,
      include: [{ model: SaleItem, as: 'items' }],
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getSaleById = async (req: AuthRequest, res: Response) => {
  try {
    const sale = await Sale.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.tenant?.id 
      },
      include: [
        { model: SaleItem, as: 'items', include: [{ model: Medicine, as: 'medicine' }] }
      ]
    });
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateSale = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { 
      customer_name, customer_phone, payment_method, items, discount = 0, additional_charges = 0, billing_date,
      patient_age, patient_gender, patient_address,
      doctor_name, doctor_reg_no, prescription_no, prescription_date, prescription_image_url, notes,
      amount_received, status = 'COMPLETED'
    } = req.body;

    const sale = await Sale.findOne({ where: { id, tenant_id: req.tenant?.id }, transaction: t });
    if (!sale) throw new Error('Sale not found');

    const wasDraft = sale.status === 'DRAFT';

    let subtotal = 0;
    let totalGst = 0;

    for (const item of items) {
      subtotal += Number(item.price) * Number(item.quantity);
      totalGst += (Number(item.price) * Number(item.quantity)) * (Number(item.gst) / 100);
    }

    await sale.update({
      customer_name: customer_name || 'Walk-in Customer',
      customer_phone: customer_phone || null,
      payment_method: payment_method || 'CASH',
      status: status,
      subtotal,
      gst_amount: totalGst,
      discount: discount,
      additional_charges: additional_charges,
      total_amount: subtotal + totalGst - discount + Number(additional_charges),
      amount_received: amount_received || (subtotal + totalGst - discount + Number(additional_charges)),
      balance_amount: (subtotal + totalGst - discount + Number(additional_charges)) - (amount_received || (subtotal + totalGst - discount + Number(additional_charges))),
      billing_date: billing_date ? new Date(billing_date) : sale.billing_date,
      patient_age,
      patient_gender,
      patient_address,
      doctor_name,
      doctor_reg_no,
      prescription_no,
      prescription_date: prescription_date ? new Date(prescription_date) : sale.prescription_date,
      prescription_image_url,
      notes
    }, { transaction: t });

    // Delete existing items
    await SaleItem.destroy({ where: { sale_id: sale.id }, transaction: t });

    // Re-insert items
    for (const item of items) {
      let finalMedicineId = item.medicine_id;
      let purchasePrice = 0;

      if (item.isExternal) {
        const newMed = await Medicine.create({
          tenant_id: req.tenant?.id,
          name: item.name || 'Unknown External Item',
          batch_number: item.batch || `EXT-${Date.now()}`,
          purchase_price: item.price,
          selling_price: item.price,
          mrp: item.mrp || item.price,
          gst_percentage: item.gst || 0,
          stock_quantity: 0,
          minimum_stock: 0,
          expiry_date: item.expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        }, { transaction: t });
        finalMedicineId = newMed.id;
        purchasePrice = Number(item.price);
      } else {
        const med = await Medicine.findOne({ where: { id: finalMedicineId }, transaction: t });
        purchasePrice = med ? Number(med.purchase_price) : 0;
      }

      let discountRatio = 0;
      if (subtotal > 0 && discount > 0) {
        discountRatio = discount / subtotal;
      }
      const itemSubtotal = Number(item.price) * Number(item.quantity);
      const itemDiscount = itemSubtotal * discountRatio;
      const unitDiscount = Number(item.quantity) > 0 ? itemDiscount / Number(item.quantity) : 0;
      const profitPerUnit = Number(item.price) - purchasePrice - unitDiscount;

      await SaleItem.create({
        sale_id: sale.id,
        medicine_id: finalMedicineId,
        quantity: item.quantity,
        price: item.price,
        gst: item.gst,
        total: item.total,
        purchase_price_snapshot: purchasePrice,
        discount_snapshot: unitDiscount,
        profit_snapshot: profitPerUnit
      }, { transaction: t });

      // Update Inventory if changing from DRAFT to COMPLETED
      if (wasDraft && status === 'COMPLETED') {
        const medicine = await Medicine.findOne({ where: { id: finalMedicineId }, transaction: t });
        if (medicine) {
          await medicine.update({ stock_quantity: medicine.stock_quantity - item.quantity }, { transaction: t });

          await InventoryTransaction.create({
            tenant_id: req.tenant?.id,
            medicine_id: finalMedicineId,
            transaction_type: 'OUT',
            quantity: item.quantity,
            reference_id: sale.id,
            created_by: req.user?.id
          }, { transaction: t });
        }
      }
    }

    await t.commit();
    res.json({ success: true, message: 'Sale updated', data: sale });
  } catch (error: any) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const Op = db.Sequelize.Op;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.findAll({
      where: {
        tenant_id: req.tenant?.id,
        status: 'COMPLETED',
        created_at: {
          [Op.gte]: today
        }
      },
      include: [{ model: SaleItem, as: 'items' }]
    });

    const billsToday = sales.length;
    const salesToday = sales.reduce((sum: number, sale: any) => sum + Number(sale.total_amount), 0);
    const averageBill = billsToday > 0 ? salesToday / billsToday : 0;
    
    let cashSales = 0;
    let upiSales = 0;
    let cardSales = 0;

    const productCounts: Record<string, { name: string, qty: number }> = {};

    sales.forEach((sale: any) => {
      const pm = sale.payment_method?.toUpperCase() || '';
      if (pm.includes('CASH')) cashSales += Number(sale.total_amount);
      if (pm.includes('UPI')) upiSales += Number(sale.total_amount);
      if (pm.includes('CARD')) cardSales += Number(sale.total_amount);

      sale.items?.forEach((item: any) => {
        if (!productCounts[item.medicine_id]) {
          productCounts[item.medicine_id] = { name: item.name || 'Unknown', qty: 0 };
        }
        productCounts[item.medicine_id].qty += Number(item.quantity);
      });
    });

    let topProduct = 'None';
    let maxQty = 0;
    for (const id in productCounts) {
      if (productCounts[id].qty > maxQty) {
        maxQty = productCounts[id].qty;
        topProduct = productCounts[id].name;
      }
    }

    res.json({
      success: true,
      data: {
        salesToday,
        billsToday,
        averageBill,
        cashSales,
        upiSales,
        cardSales,
        topProduct
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const processReturn = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { returnItems } = req.body; // Array of { saleItemId, quantityToReturn }

    const sale = await Sale.findOne({
      where: { id, tenant_id: req.tenant?.id },
      include: [{ model: SaleItem, as: 'items' }],
      transaction: t
    });

    if (!sale) throw new Error('Sale not found');

    let totalRefund = 0;

    for (const returnItem of returnItems) {
      const saleItem = sale.items.find((i: any) => i.id === returnItem.saleItemId);
      if (!saleItem) continue;

      if (returnItem.quantityToReturn > saleItem.quantity) {
        throw new Error(`Cannot return more than purchased for ${saleItem.name}`);
      }

      // Calculate refund for this item based on original unit price
      const unitPrice = Number(saleItem.price);
      const unitGst = unitPrice * (Number(saleItem.gst) / 100);
      const refundAmount = (unitPrice + unitGst) * returnItem.quantityToReturn;
      totalRefund += refundAmount;

      // Update Inventory
      const medicine = await Medicine.findOne({ where: { id: saleItem.medicine_id }, transaction: t });
      if (medicine) {
        await medicine.update({ stock_quantity: medicine.stock_quantity + returnItem.quantityToReturn }, { transaction: t });
        
        await InventoryTransaction.create({
          tenant_id: req.tenant?.id,
          medicine_id: medicine.id,
          transaction_type: 'IN',
          quantity: returnItem.quantityToReturn,
          reference_id: sale.id, // Or create a Return model and use that
          notes: 'Sales Return',
          created_by: req.user?.id
        }, { transaction: t });
      }

      // Deduct quantity from SaleItem (simple approach) or create Return records.
      // For simplicity, we just update the SaleItem and Sale totals.
      await saleItem.update({
        quantity: saleItem.quantity - returnItem.quantityToReturn,
        total: Number(saleItem.total) - refundAmount
      }, { transaction: t });
    }

    await sale.update({
      total_amount: Number(sale.total_amount) - totalRefund,
      subtotal: Number(sale.subtotal) - totalRefund // Simplified
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Return processed successfully', refundAmount: totalRefund });
  } catch (error: any) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getMedicineSalesHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const sales = await SaleItem.findAndCountAll({
      where: { medicine_id: medicineId },
      include: [
        {
          model: Sale,
          where: { tenant_id: req.tenant?.id, status: 'COMPLETED' },
          attributes: ['id', 'invoice_number', 'customer_name', 'customer_id', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({ success: true, data: sales });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
