// ─── Master Data Types ─────────────────────────────────────────────
export interface PharmaCompany {
  id: string
  name: string
  order_form_pref?: number
  invoice_printing_pref?: number
  dump_days?: number
  expiry_receive_upto?: number
  minimum_margin?: number
  sales_tax?: number
  sales_tax_cess?: number
  purchase_tax?: number
  purchase_tax_cess?: number
}

export interface SaltComposition {
  id: string
  name: string
}

export interface HsnSacMaster {
  id: string
  hsn_code: string
  short_name?: string
  sgst: number
  cgst: number
  igst: number
  type: string
  uqc?: string
  cess: number
}

export interface CategoryMaster {
  id: string
  name: string
  description?: string
  minimum_margin?: number
}

// ─── Medicine Types ───────────────────────────────────────────────
export interface Medicine {
  id: string
  name: string
  genericName?: string
  manufacturer?: string
  category?: string
  category_id?: string
  company_id?: string
  salt_id?: string
  hsn_sac_id?: string
  batchNo?: string
  expiryDate?: string
  mrp?: number
  purchasePrice?: number
  sellingPrice?: number
  stock?: number
  minStock?: number
  unit?: string
  hsn?: string
  gstRate?: number
  rack?: string
  barcode?: string

  // Marg ERP Specific Fields
  status?: string
  type?: string
  hide?: string
  packing?: string
  unit_1st?: string
  unit_2nd?: string
  decimal_allowed?: string
  color_type?: string
  item_type?: string
  local_tax?: string
  central_tax?: string
  rate_a?: number
  rate_b?: number
  rate_c?: number
  cost?: number
  conv_strip?: number
  conv_case?: number
  csr?: number
  sgst?: number
  cgst?: number
  igst?: number
  allow_negative?: string
  more_options?: string

  Category?: CategoryMaster
  Company?: PharmaCompany
  Salt?: SaltComposition
  HsnSac?: HsnSacMaster
}

export interface CartItem extends Medicine {
  quantity: number
  discount: number
}

// ─── Customer Types ───────────────────────────────────────────────
export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  loyaltyPoints: number
  totalPurchases: number
  outstandingAmount: number
  lastPurchase: string
  type: 'regular' | 'premium' | 'wholesale'
  avatar?: string
}

// ─── Doctor Types ─────────────────────────────────────────────────
export interface Doctor {
  id: string
  name: string
  phone: string
  reg_no?: string
  commission_percent: number
  address?: string
  speciality?: string
  qualification?: string
}

// ─── Supplier Types ───────────────────────────────────────────────
export interface Supplier {
  id: string
  name: string
  phone: string
  email: string
  address: string
  gstNo: string
  totalPurchases: number
  outstanding: number
  lastOrder: string
}

// ─── Purchase / Sale Types ─────────────────────────────────────────
export interface PurchaseOrder {
  id: string
  supplier: string
  invoiceNo: string
  date: string
  totalAmount: number
  status: 'pending' | 'received' | 'partial'
  items: number
}

export interface SaleInvoice {
  id: string
  customer: string
  date: string
  amount: number
  items: number
  paymentMethod: 'cash' | 'upi' | 'card' | 'credit'
  status: 'paid' | 'credit' | 'partial'
}

// ─── Store Types ──────────────────────────────────────────────────
export interface Store {
  id: string
  name: string
  location: string
  manager: string
  revenue: number
  stock: number
  sales: number
}

// ─── Notification Types ───────────────────────────────────────────
export interface Notification {
  id: string
  type: 'expiry' | 'stock' | 'payment' | 'achievement' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

// ─── AI Types ─────────────────────────────────────────────────────
export interface AIInsight {
  id: string
  type: 'warning' | 'success' | 'info' | 'tip'
  title: string
  description: string
  action?: string
  metric?: string
  change?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  time: string
}

// ─── Chart Types ──────────────────────────────────────────────────
export interface RevenueData {
  month: string
  revenue: number
  purchase: number
  profit: number
}

export interface TopMedicine {
  name: string
  sales: number
  revenue: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

// ─── User / Role Types ─────────────────────────────────────────────
export type UserRole = 'owner' | 'manager' | 'cashier' | 'pharmacist' | 'accountant'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  avatar?: string
  email: string
}
