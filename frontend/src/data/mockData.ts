import type {
  Medicine,
  Customer,
  Supplier,
  PurchaseOrder,
  SaleInvoice,
  Store,
  RevenueData,
  TopMedicine,
  CategoryData,
  AIInsight,
} from '@/types'

// ─── Medicines ────────────────────────────────────────────────────
export const medicines: Medicine[] = [
  { id: 'm1', name: 'Paracetamol 500mg', genericName: 'Paracetamol', manufacturer: 'Cipla', category: 'Analgesics', batchNo: 'B2401', expiryDate: '2026-12-31', mrp: 22, purchasePrice: 10, sellingPrice: 20, stock: 120, minStock: 50, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'A-01', barcode: '8901234567890' },
  { id: 'm2', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', manufacturer: 'Sun Pharma', category: 'Antibiotics', batchNo: 'B2402', expiryDate: '2026-06-30', mrp: 85, purchasePrice: 40, sellingPrice: 78, stock: 45, minStock: 30, unit: 'Strip', hsn: '30041090', gstRate: 12, rack: 'B-03', barcode: '8901234567891' },
  { id: 'm3', name: 'Metformin 500mg', genericName: 'Metformin HCl', manufacturer: 'Mankind', category: 'Diabetes', batchNo: 'B2403', expiryDate: '2027-03-31', mrp: 35, purchasePrice: 14, sellingPrice: 30, stock: 200, minStock: 80, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'C-02', barcode: '8901234567892' },
  { id: 'm4', name: 'Atorvastatin 10mg', genericName: 'Atorvastatin', manufacturer: 'Pfizer', category: 'Cardiac', batchNo: 'B2404', expiryDate: '2026-09-30', mrp: 65, purchasePrice: 28, sellingPrice: 58, stock: 80, minStock: 40, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'D-01', barcode: '8901234567893' },
  { id: 'm5', name: 'Omeprazole 20mg', genericName: 'Omeprazole', manufacturer: 'Zydus', category: 'Gastric', batchNo: 'B2405', expiryDate: '2027-01-31', mrp: 55, purchasePrice: 22, sellingPrice: 48, stock: 15, minStock: 30, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'E-04', barcode: '8901234567894' },
  { id: 'm6', name: 'Azithromycin 500mg', genericName: 'Azithromycin', manufacturer: 'Lupin', category: 'Antibiotics', batchNo: 'B2406', expiryDate: '2026-07-31', mrp: 120, purchasePrice: 55, sellingPrice: 108, stock: 60, minStock: 25, unit: 'Strip', hsn: '30041090', gstRate: 12, rack: 'B-05', barcode: '8901234567895' },
  { id: 'm7', name: 'Cetirizine 10mg', genericName: 'Cetirizine HCl', manufacturer: 'Cipla', category: 'Antiallergic', batchNo: 'B2407', expiryDate: '2027-06-30', mrp: 30, purchasePrice: 12, sellingPrice: 26, stock: 150, minStock: 60, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'F-01', barcode: '8901234567896' },
  { id: 'm8', name: 'Insulin Glargine', genericName: 'Insulin Glargine', manufacturer: 'Sanofi', category: 'Diabetes', batchNo: 'B2408', expiryDate: '2026-08-31', mrp: 650, purchasePrice: 420, sellingPrice: 600, stock: 25, minStock: 15, unit: 'Vial', hsn: '30043100', gstRate: 5, rack: 'C-01', barcode: '8901234567897' },
  { id: 'm9', name: 'Dolo 650', genericName: 'Paracetamol', manufacturer: 'Micro Labs', category: 'Analgesics', batchNo: 'B2409', expiryDate: '2027-02-28', mrp: 32, purchasePrice: 13, sellingPrice: 28, stock: 300, minStock: 100, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'A-02', barcode: '8901234567898' },
  { id: 'm10', name: 'Pantoprazole 40mg', genericName: 'Pantoprazole', manufacturer: 'Sun Pharma', category: 'Gastric', batchNo: 'B2410', expiryDate: '2026-11-30', mrp: 75, purchasePrice: 30, sellingPrice: 65, stock: 90, minStock: 40, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'E-02', barcode: '8901234567899' },
  { id: 'm11', name: 'Amlodipine 5mg', genericName: 'Amlodipine', manufacturer: 'Mankind', category: 'Cardiac', batchNo: 'B2411', expiryDate: '2027-04-30', mrp: 45, purchasePrice: 18, sellingPrice: 40, stock: 110, minStock: 50, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'D-02', barcode: '8901234567900' },
  { id: 'm12', name: 'Vitamin D3 60K', genericName: 'Cholecalciferol', manufacturer: 'Alkem', category: 'Vitamins', batchNo: 'B2412', expiryDate: '2027-08-31', mrp: 95, purchasePrice: 40, sellingPrice: 85, stock: 70, minStock: 30, unit: 'Sachet', hsn: '30049099', gstRate: 12, rack: 'G-01', barcode: '8901234567901' },
  { id: 'm13', name: 'Cefixime 200mg', genericName: 'Cefixime', manufacturer: 'Lupin', category: 'Antibiotics', batchNo: 'B2413', expiryDate: '2026-06-15', mrp: 110, purchasePrice: 52, sellingPrice: 98, stock: 8, minStock: 20, unit: 'Strip', hsn: '30041090', gstRate: 12, rack: 'B-06', barcode: '8901234567902' },
  { id: 'm14', name: 'Montelukast 10mg', genericName: 'Montelukast', manufacturer: 'Cipla', category: 'Respiratory', batchNo: 'B2414', expiryDate: '2027-05-31', mrp: 85, purchasePrice: 35, sellingPrice: 75, stock: 55, minStock: 25, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'F-03', barcode: '8901234567903' },
  { id: 'm15', name: 'Losartan 50mg', genericName: 'Losartan Potassium', manufacturer: 'Zydus', category: 'Cardiac', batchNo: 'B2415', expiryDate: '2027-01-31', mrp: 60, purchasePrice: 25, sellingPrice: 54, stock: 130, minStock: 60, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'D-03', barcode: '8901234567904' },
  { id: 'm16', name: 'Calpol 500', genericName: 'Paracetamol', manufacturer: 'GSK', category: 'Analgesics', batchNo: 'B2416', expiryDate: '2026-10-31', mrp: 18, purchasePrice: 15, sellingPrice: 16, stock: 200, minStock: 50, unit: 'Strip', hsn: '30049099', gstRate: 12, rack: 'A-03', barcode: '8901234567905' },
  { id: 'm17', name: 'Moxikind 500', genericName: 'Amoxicillin', manufacturer: 'Mankind', category: 'Antibiotics', batchNo: 'B2417', expiryDate: '2027-02-28', mrp: 75, purchasePrice: 20, sellingPrice: 70, stock: 150, minStock: 40, unit: 'Strip', hsn: '30041090', gstRate: 12, rack: 'B-04', barcode: '8901234567906' },
]

// ─── Customers ─────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'c1', name: 'Suresh Kumar', phone: '9876543210', email: 'suresh@gmail.com', address: '12, MG Road, Bengaluru', loyaltyPoints: 450, totalPurchases: 28500, outstandingAmount: 0, lastPurchase: '2026-06-16', type: 'premium' },
  { id: 'c2', name: 'City Hospital', phone: '9123456789', email: 'purchase@cityhospital.in', address: 'Hospital Road, Bengaluru', loyaltyPoints: 1200, totalPurchases: 185000, outstandingAmount: 45000, lastPurchase: '2026-06-14', type: 'wholesale' },
  { id: 'c3', name: 'Priya Nair', phone: '9765432109', email: 'priya.nair@gmail.com', address: '5, JP Nagar, Bengaluru', loyaltyPoints: 220, totalPurchases: 12400, outstandingAmount: 0, lastPurchase: '2026-06-15', type: 'regular' },
  { id: 'c4', name: 'Ram Medical Store', phone: '9654321098', email: 'ram@medstore.in', address: 'Commercial Street, Bengaluru', loyaltyPoints: 890, totalPurchases: 95000, outstandingAmount: 12000, lastPurchase: '2026-06-12', type: 'wholesale' },
  { id: 'c5', name: 'Anita Sharma', phone: '9543210987', email: 'anita.s@gmail.com', address: '8, Koramangala, Bengaluru', loyaltyPoints: 310, totalPurchases: 18600, outstandingAmount: 0, lastPurchase: '2026-06-17', type: 'premium' },
  { id: 'c6', name: 'Green Pharmacy Chain', phone: '9432109876', email: 'orders@greenpharm.in', address: 'Brigade Road, Bengaluru', loyaltyPoints: 2100, totalPurchases: 320000, outstandingAmount: 78000, lastPurchase: '2026-06-10', type: 'wholesale' },
  { id: 'c7', name: 'Mohan Das', phone: '9321098765', email: 'mohandas@yahoo.com', address: '22, Indiranagar, Bengaluru', loyaltyPoints: 180, totalPurchases: 8900, outstandingAmount: 0, lastPurchase: '2026-06-16', type: 'regular' },
  { id: 'c8', name: 'Kavya Reddy', phone: '9210987654', email: 'kavya.r@gmail.com', address: '15, HSR Layout, Bengaluru', loyaltyPoints: 520, totalPurchases: 34200, outstandingAmount: 1500, lastPurchase: '2026-06-15', type: 'premium' },
]

// ─── Suppliers ─────────────────────────────────────────────────────
export const suppliers: Supplier[] = [
  { id: 's1', name: 'Sun Pharma Distributors', phone: '9800001111', email: 'orders@sunpharma.com', address: 'Industrial Area, Mumbai', gstNo: '27AAACS1234A1Z5', totalPurchases: 450000, outstanding: 85000, lastOrder: '2026-06-10' },
  { id: 's2', name: 'Cipla Supply Co.', phone: '9800002222', email: 'supply@cipla.com', address: 'MIDC, Pune', gstNo: '27AAACC5678B1Z5', totalPurchases: 280000, outstanding: 42000, lastOrder: '2026-06-12' },
  { id: 's3', name: 'Lupin Medical Dist.', phone: '9800003333', email: 'dist@lupin.com', address: 'Kalyan, Mumbai', gstNo: '27AAABL9012C1Z5', totalPurchases: 195000, outstanding: 28000, lastOrder: '2026-06-08' },
  { id: 's4', name: 'Mankind Pharma Hub', phone: '9800004444', email: 'hub@mankind.in', address: 'Delhi NCR', gstNo: '07AAACM3456D1Z5', totalPurchases: 320000, outstanding: 55000, lastOrder: '2026-06-14' },
  { id: 's5', name: 'Zydus Health Depot', phone: '9800005555', email: 'depot@zydus.com', address: 'Ahmedabad', gstNo: '24AAACZ7890E1Z5', totalPurchases: 160000, outstanding: 0, lastOrder: '2026-06-15' },
]

// ─── Purchase Orders ───────────────────────────────────────────────
export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po1', supplier: 'Sun Pharma Distributors', invoiceNo: 'SP-2024-4521', date: '2026-06-15', totalAmount: 85000, status: 'received', items: 12 },
  { id: 'po2', supplier: 'Cipla Supply Co.', invoiceNo: 'CP-2024-3312', date: '2026-06-12', totalAmount: 42000, status: 'received', items: 8 },
  { id: 'po3', supplier: 'Mankind Pharma Hub', invoiceNo: 'MP-2024-2198', date: '2026-06-10', totalAmount: 28500, status: 'pending', items: 6 },
  { id: 'po4', supplier: 'Lupin Medical Dist.', invoiceNo: 'LM-2024-1876', date: '2026-06-08', totalAmount: 55000, status: 'partial', items: 15 },
  { id: 'po5', supplier: 'Zydus Health Depot', invoiceNo: 'ZH-2024-4432', date: '2026-06-05', totalAmount: 32000, status: 'received', items: 10 },
  { id: 'po6', supplier: 'Sun Pharma Distributors', invoiceNo: 'SP-2024-4498', date: '2026-06-01', totalAmount: 68000, status: 'received', items: 18 },
]

// ─── Sales Invoices ────────────────────────────────────────────────
export const salesInvoices: SaleInvoice[] = [
  { id: 'inv1', customer: 'City Hospital', date: '2026-06-17', amount: 18500, items: 12, paymentMethod: 'credit', status: 'credit' },
  { id: 'inv2', customer: 'Suresh Kumar', date: '2026-06-17', amount: 456, items: 3, paymentMethod: 'upi', status: 'paid' },
  { id: 'inv3', customer: 'Priya Nair', date: '2026-06-17', amount: 890, items: 5, paymentMethod: 'cash', status: 'paid' },
  { id: 'inv4', customer: 'Green Pharmacy Chain', date: '2026-06-16', amount: 45000, items: 28, paymentMethod: 'credit', status: 'credit' },
  { id: 'inv5', customer: 'Anita Sharma', date: '2026-06-16', amount: 1250, items: 4, paymentMethod: 'card', status: 'paid' },
  { id: 'inv6', customer: 'Ram Medical Store', date: '2026-06-15', amount: 22000, items: 15, paymentMethod: 'upi', status: 'paid' },
  { id: 'inv7', customer: 'Kavya Reddy', date: '2026-06-15', amount: 780, items: 2, paymentMethod: 'cash', status: 'paid' },
  { id: 'inv8', customer: 'Mohan Das', date: '2026-06-14', amount: 320, items: 1, paymentMethod: 'upi', status: 'paid' },
]

// ─── Stores ────────────────────────────────────────────────────────
export const stores: Store[] = [
  { id: 'store-1', name: 'MediFlow - Koramangala', location: 'Koramangala, Bengaluru', manager: 'Rajesh Sharma', revenue: 285000, stock: 450, sales: 1240 },
  { id: 'store-2', name: 'MediFlow - Indiranagar', location: 'Indiranagar, Bengaluru', manager: 'Priti Verma', revenue: 198000, stock: 380, sales: 920 },
  { id: 'store-3', name: 'MediFlow - JP Nagar', location: 'JP Nagar, Bengaluru', manager: 'Sunil Patil', revenue: 142000, stock: 290, sales: 680 },
  { id: 'store-4', name: 'MediFlow - Whitefield', location: 'Whitefield, Bengaluru', manager: 'Divya Rao', revenue: 215000, stock: 410, sales: 1050 },
]

// ─── Revenue Data ─────────────────────────────────────────────────
export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 215000, purchase: 145000, profit: 70000 },
  { month: 'Feb', revenue: 242000, purchase: 162000, profit: 80000 },
  { month: 'Mar', revenue: 198000, purchase: 130000, profit: 68000 },
  { month: 'Apr', revenue: 278000, purchase: 185000, profit: 93000 },
  { month: 'May', revenue: 312000, purchase: 205000, profit: 107000 },
  { month: 'Jun', revenue: 285000, purchase: 190000, profit: 95000 },
]

// ─── Top Medicines ─────────────────────────────────────────────────
export const topMedicines: TopMedicine[] = [
  { name: 'Paracetamol 500', sales: 482, revenue: 9640 },
  { name: 'Metformin 500', sales: 378, revenue: 11340 },
  { name: 'Dolo 650', sales: 356, revenue: 9968 },
  { name: 'Amoxicillin 500', sales: 289, revenue: 22542 },
  { name: 'Atorvastatin 10', sales: 245, revenue: 14210 },
  { name: 'Cetirizine 10', sales: 210, revenue: 5460 },
]

// ─── Category Sales ────────────────────────────────────────────────
export const categoryData: CategoryData[] = [
  { name: 'Antibiotics', value: 35, color: '#6366f1' },
  { name: 'Diabetes', value: 25, color: '#8b5cf6' },
  { name: 'Cardiac', value: 18, color: '#06b6d4' },
  { name: 'Analgesics', value: 12, color: '#10b981' },
  { name: 'Gastric', value: 6, color: '#f59e0b' },
  { name: 'Others', value: 4, color: '#f43f5e' },
]

// ─── AI Insights ──────────────────────────────────────────────────
export const aiInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'warning',
    title: '5 medicines expire within 30 days',
    description: 'Amoxicillin, Cefixime, Azithromycin and 2 others will expire. Estimated loss: ₹12,400',
    action: 'View Expiry Report',
    metric: '₹12,400',
    change: -15,
  },
  {
    id: 'ai2',
    type: 'success',
    title: 'Paracetamol demand up 23%',
    description: 'Flu season spike detected. Consider stocking up. Current stock: 420 strips',
    action: 'Create Purchase Order',
    metric: '+23%',
    change: 23,
  },
  {
    id: 'ai3',
    type: 'tip',
    title: 'Diabetes category = 35% profits',
    description: 'Your diabetes medicines generate 35% of profits. Consider expanding this category.',
    action: 'View Analytics',
    metric: '35%',
    change: 8,
  },
  {
    id: 'ai4',
    type: 'info',
    title: 'Slow-moving: Montelukast 10mg',
    description: '55 strips unsold for 45 days. Consider discount or return to supplier.',
    action: 'View Stock',
    metric: '55 strips',
  },
]

// ─── Recent Activities ─────────────────────────────────────────────
export const recentActivities = [
  { id: 'a1', type: 'sale', message: 'Invoice #INV-1842 created for City Hospital', amount: '₹18,500', time: '2 min ago', color: 'text-green-500' },
  { id: 'a2', type: 'purchase', message: 'PO #4521 received from Sun Pharma', amount: '₹85,000', time: '45 min ago', color: 'text-blue-500' },
  { id: 'a3', type: 'expiry', message: 'Alert: Cefixime 200mg expires in 28 days', amount: '8 strips', time: '1 hour ago', color: 'text-amber-500' },
  { id: 'a4', type: 'stock', message: 'Low stock alert: Omeprazole 20mg', amount: '15 strips', time: '2 hours ago', color: 'text-rose-500' },
  { id: 'a5', type: 'payment', message: 'Payment received from Green Pharmacy', amount: '₹45,000', time: '3 hours ago', color: 'text-emerald-500' },
  { id: 'a6', type: 'sale', message: 'Invoice #INV-1841 created for Suresh Kumar', amount: '₹456', time: '4 hours ago', color: 'text-green-500' },
]

// ─── AI Medicine Search results ─────────────────────────────────────
export const aiSearchResults = {
  'fever medicine': [
    { name: 'Dolo 650', genericName: 'Paracetamol', stock: 300, mrp: 32, relevance: 98 },
    { name: 'Paracetamol 500mg', genericName: 'Paracetamol', stock: 120, mrp: 22, relevance: 95 },
    { name: 'Crocin Advance', genericName: 'Paracetamol 500mg', stock: 0, mrp: 28, relevance: 90 },
    { name: 'Meftal-Spas', genericName: 'Mefenamic Acid', stock: 45, mrp: 65, relevance: 75 },
  ],
  'diabetes medicine': [
    { name: 'Metformin 500mg', genericName: 'Metformin HCl', stock: 200, mrp: 35, relevance: 99 },
    { name: 'Insulin Glargine', genericName: 'Insulin Glargine', stock: 25, mrp: 650, relevance: 95 },
    { name: 'Glimepiride 1mg', genericName: 'Glimepiride', stock: 80, mrp: 45, relevance: 90 },
  ],
  'blood pressure': [
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', stock: 110, mrp: 45, relevance: 98 },
    { name: 'Losartan 50mg', genericName: 'Losartan Potassium', stock: 130, mrp: 60, relevance: 95 },
    { name: 'Atorvastatin 10mg', genericName: 'Atorvastatin', stock: 80, mrp: 65, relevance: 80 },
  ],
}

// ─── AI Copilot Responses ──────────────────────────────────────────
export const aiCopilotResponses: Record<string, string> = {
  stock: "📦 Current stock status: 450 SKUs in inventory. 5 items are critically low (below minimum), 3 items are expiring within 30 days. Top in-stock: Dolo 650 (300 strips), Losartan 50mg (130 strips).",
  sales: "💰 Today's sales: ₹28,456 across 42 invoices. Best-selling today: Paracetamol 500mg (82 strips). Payment split: Cash 35%, UPI 45%, Credit 20%.",
  expiry: "⚠️ Expiry Alert: 5 medicines expiring in the next 30 days. Amoxicillin 500mg (Jun 30), Cefixime 200mg (Jun 15 - CRITICAL), Azithromycin 500mg (Jul 31), Insulin Glargine (Aug 31), Amoxicillin 250mg (Jul 15). Estimated loss if unsold: ₹12,400.",
  profit: "📈 This month's profit: ₹95,000 (33% margin). Top profit contributor: Diabetes category (₹33,250). Compared to last month, profit is up by 8.4%.",
  default: "👋 I'm your MediFlow AI Assistant! I can help you with:\n• Stock queries (type 'stock')\n• Today's sales (type 'sales')\n• Expiry alerts (type 'expiry')\n• Profit analysis (type 'profit')",
}
