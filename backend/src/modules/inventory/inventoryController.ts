import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { PurchaseOrder, PurchaseOrderItem, Supplier, Medicine } = db;

export const getMedicinePurchaseHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;

    const purchases = await PurchaseOrderItem.findAll({
      where: { medicine_id: medicineId },
      include: [
        {
          model: PurchaseOrder,
          where: { tenant_id: req.tenant?.id, status: 'RECEIVED' },
          attributes: ['id', 'order_date', 'supplier_id'],
          include: [
            {
              model: Supplier,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [[{ model: PurchaseOrder }, 'order_date', 'DESC']],
      limit: 50
    });

    const medicine = await Medicine.findOne({
      where: { id: medicineId, tenant_id: req.tenant?.id },
      attributes: ['purchase_price']
    });

    let highestPrice = 0;
    let lowestPrice = Infinity;
    let totalPrice = 0;
    let totalQuantity = 0;

    purchases.forEach((item: any) => {
      const price = Number(item.price);
      highestPrice = Math.max(highestPrice, price);
      lowestPrice = Math.min(lowestPrice, price);
      totalPrice += price * Number(item.quantity);
      totalQuantity += Number(item.quantity);
    });

    if (purchases.length === 0) {
      lowestPrice = 0;
    }

    const averagePrice = totalQuantity > 0 ? totalPrice / totalQuantity : 0;

    res.json({
      success: true,
      data: {
        history: purchases,
        summary: {
          lastPurchasePrice: purchases.length > 0 ? Number(purchases[0].price) : 0,
          averagePurchasePrice: averagePrice,
          highestPurchasePrice: highestPrice,
          lowestPurchasePrice: lowestPrice,
          lastPurchaseDate: purchases.length > 0 ? purchases[0].PurchaseOrder.order_date : null,
          currentCostPrice: medicine ? Number(medicine.purchase_price) : 0
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getMedicineBatches = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findOne({
      where: { id: medicineId, tenant_id: req.tenant?.id },
      attributes: ['id', 'name', 'batch_number', 'expiry_date', 'stock_quantity', 'purchase_price']
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    // Since we are not using a separate medicine_batches table yet, return the single batch on the medicine record.
    const batches = [{
      batch_number: medicine.batch_number || 'N/A',
      expiry_date: medicine.expiry_date,
      stock_quantity: medicine.stock_quantity,
      purchase_price: medicine.purchase_price
    }];

    res.json({ success: true, data: batches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
