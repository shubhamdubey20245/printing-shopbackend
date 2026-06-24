import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { PurchaseOrder, PurchaseOrderItem, Supplier, Medicine, InventoryTransaction } = db;
import sequelize from '../../config/database';

export const getPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await PurchaseOrder.findAll({
      where: { tenant_id: req.tenant?.id },
      include: [
        { model: Supplier, attributes: ['name', 'contact_person'] },
        { model: PurchaseOrderItem, as: 'items', include: [{ model: Medicine, attributes: ['name'] }] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, message: 'Purchases retrieved', data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createPurchase = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { supplier_id, total_amount, items } = req.body;
    
    const purchase = await PurchaseOrder.create({
      tenant_id: req.tenant?.id,
      supplier_id,
      total_amount,
      status: 'PENDING',
      created_by: req.user?.id
    }, { transaction: t });

    if (items && items.length > 0) {
      const purchaseItems = items.map((item: any) => ({
        purchase_order_id: purchase.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }));
      await PurchaseOrderItem.bulkCreate(purchaseItems, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Purchase Order created', data: purchase });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const receivePurchase = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const purchase = await PurchaseOrder.findOne({ 
      where: { id, tenant_id: req.tenant?.id },
      include: [{ model: PurchaseOrderItem, as: 'items' }]
    });

    if (!purchase) return res.status(404).json({ success: false, message: 'Not found' });
    if (purchase.status === 'RECEIVED') {
      return res.status(400).json({ success: false, message: 'Already received' });
    }

    // Update status
    await purchase.update({ status: 'RECEIVED' }, { transaction: t });

    // Update Inventory
    for (const item of (purchase as any).items) {
      const medicine = await Medicine.findOne({ where: { id: item.medicine_id }, transaction: t });
      if (medicine) {
        await medicine.update({ stock_quantity: medicine.stock_quantity + item.quantity }, { transaction: t });
        
        // Log transaction
        await InventoryTransaction.create({
          tenant_id: req.tenant?.id,
          medicine_id: item.medicine_id,
          transaction_type: 'IN',
          quantity: item.quantity,
          reference_id: purchase.id,
          created_by: req.user?.id
        }, { transaction: t });
      }
    }

    await t.commit();
    res.json({ success: true, message: 'Purchase Order received and inventory updated' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
