import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { Sale, SaleItem, Medicine, PurchaseOrder, PurchaseOrderItem, InventoryTransaction, Customer } = db;
import { Op } from 'sequelize';

export const getMedicinePricing = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findOne({
      where: { id: medicineId, tenant_id: req.tenant?.id }
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    // 1. Selling Analytics
    const saleItems = await SaleItem.findAll({
      where: { medicine_id: medicineId },
      include: [{
        model: Sale,
        where: { tenant_id: req.tenant?.id, status: 'COMPLETED' },
        attributes: ['id', 'created_at']
      }],
      order: [[{ model: Sale }, 'created_at', 'DESC']]
    });

    let highestSelling = 0;
    let lowestSelling = Infinity;
    let totalSellingAmount = 0;
    let totalSoldQty = 0;
    const lastSellingPrice = saleItems.length > 0 ? Number(saleItems[0].price) : 0;
    
    saleItems.forEach((item: any) => {
      const p = Number(item.price);
      const q = Number(item.quantity);
      highestSelling = Math.max(highestSelling, p);
      lowestSelling = Math.min(lowestSelling, p);
      totalSellingAmount += p * q;
      totalSoldQty += q;
    });

    const averageSellingPrice = totalSoldQty > 0 ? totalSellingAmount / totalSoldQty : 0;
    if (saleItems.length === 0) lowestSelling = 0;

    // 2. Purchase Analytics
    const purchaseItems = await PurchaseOrderItem.findAll({
      where: { medicine_id: medicineId },
      include: [{
        model: PurchaseOrder,
        where: { tenant_id: req.tenant?.id, status: 'RECEIVED' },
        attributes: ['id', 'order_date']
      }],
      order: [[{ model: PurchaseOrder }, 'order_date', 'DESC']]
    });

    let highestPurchase = 0;
    let lowestPurchase = Infinity;
    let totalPurchaseAmount = 0;
    let totalPurchaseQty = 0;
    const lastPurchasePrice = purchaseItems.length > 0 ? Number(purchaseItems[0].price) : 0;

    purchaseItems.forEach((item: any) => {
      const p = Number(item.price);
      const q = Number(item.quantity);
      highestPurchase = Math.max(highestPurchase, p);
      lowestPurchase = Math.min(lowestPurchase, p);
      totalPurchaseAmount += p * q;
      totalPurchaseQty += q;
    });

    const averagePurchasePrice = totalPurchaseQty > 0 ? totalPurchaseAmount / totalPurchaseQty : 0;
    if (purchaseItems.length === 0) lowestPurchase = 0;

    res.json({
      success: true,
      data: {
        selling: {
          last: lastSellingPrice,
          highest: highestSelling,
          lowest: lowestSelling,
          average: averageSellingPrice,
          totalSold: totalSoldQty
        },
        purchase: {
          last: lastPurchasePrice,
          highest: highestPurchase,
          lowest: lowestPurchase,
          average: averagePurchasePrice,
          totalPurchased: totalPurchaseQty
        },
        current: {
          stock: Number(medicine.stock_quantity),
          sellingPrice: Number(medicine.selling_price),
          purchasePrice: Number(medicine.purchase_price)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    const { phone } = req.query;

    let whereClause: any = { tenant_id: req.tenant?.id, status: 'COMPLETED' };
    if (phone && typeof phone === 'string') {
      whereClause.customer_phone = phone;
    }

    // Since billing currently stores customer info inline on Sale, we search by customer_phone
    const sales = await SaleItem.findAll({
      where: { medicine_id: medicineId },
      include: [{
        model: Sale,
        where: whereClause,
        attributes: ['id', 'invoice_number', 'created_at', 'customer_name', 'customer_phone']
      }],
      order: [[{ model: Sale }, 'created_at', 'DESC']],
      limit: 10
    });

    const history = sales.map((item: any) => ({
      invoiceNo: item.Sale.invoice_number,
      date: item.Sale.created_at,
      customerName: item.Sale.customer_name,
      customerPhone: item.Sale.customer_phone,
      quantity: item.quantity,
      rate: Number(item.price),
      discount: Number(item.discount_snapshot || 0),
      total: Number(item.total)
    }));

    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMedicineTimeline = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    
    // 1. Get Sales
    const sales = await SaleItem.findAll({
      where: { medicine_id: medicineId },
      include: [{ model: Sale, where: { tenant_id: req.tenant?.id } }],
      order: [[{ model: Sale }, 'created_at', 'DESC']],
      limit: 20
    });

    // 2. Get Purchases
    const purchases = await PurchaseOrderItem.findAll({
      where: { medicine_id: medicineId },
      include: [{ model: PurchaseOrder, where: { tenant_id: req.tenant?.id } }],
      order: [[{ model: PurchaseOrder }, 'order_date', 'DESC']],
      limit: 20
    });

    // 3. Get Inventory transactions (adjustments, initial stock)
    const adjustments = await InventoryTransaction.findAll({
      where: { medicine_id: medicineId, tenant_id: req.tenant?.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });

    const timeline: any[] = [];
    
    sales.forEach((s: any) => {
      timeline.push({
        id: `sale-${s.id}`,
        type: 'SALE',
        date: s.Sale.created_at,
        reference: s.Sale.invoice_number,
        quantity: -s.quantity,
        price: Number(s.price),
        notes: s.notes || 'Sale'
      });
    });

    purchases.forEach((p: any) => {
      timeline.push({
        id: `po-${p.id}`,
        type: 'PURCHASE',
        date: p.PurchaseOrder.order_date,
        reference: p.PurchaseOrder.po_number,
        quantity: p.quantity,
        price: Number(p.price),
        notes: `From Supplier ID: ${p.PurchaseOrder.supplier_id}`
      });
    });

    adjustments.forEach((a: any) => {
      timeline.push({
        id: `adj-${a.id}`,
        type: a.transaction_type, // 'IN' or 'OUT' or 'ADJUSTMENT'
        date: a.created_at,
        reference: a.reference_number || 'N/A',
        quantity: a.transaction_type === 'OUT' ? -a.quantity : a.quantity,
        price: 0,
        notes: a.notes || 'Manual Adjustment'
      });
    });

    // Sort combined timeline descending
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ success: true, data: timeline.slice(0, 30) }); // Return latest 30 events
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
