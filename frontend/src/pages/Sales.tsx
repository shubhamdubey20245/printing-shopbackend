import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, FileText, Download, Plus, Search, Eye, 
  Printer, ArrowRightLeft, CreditCard, Banknote, Smartphone,
  X, ChevronRight, CheckCircle2
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatCurrency, formatDate } from '@/utils/cn'
import { useSales } from '@/hooks/useBilling'
import { useCustomers } from '@/hooks/useCustomers'

export default function Sales() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'returns'>('invoices')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  
  const { data: salesResponse } = useSales()
  const { data: customersResponse } = useCustomers()
  
  const salesInvoices = (salesResponse?.data || []).map((inv: any) => ({
    id: `INV-${inv.id.substring(0,6).toUpperCase()}`,
    originalId: inv.id,
    customer: inv.customer_name,
    customer_phone: inv.customer_phone,
    items: inv.items?.length || 1,
    date: inv.created_at,
    amount: inv.total_amount,
    status: 'paid', // Hardcoding as paid for now
    paymentMethod: inv.payment_method.toLowerCase(),
  }))

  const selectedInvoiceData = salesInvoices.find((inv: any) => inv.originalId === selectedInvoice)
  const customers = customersResponse?.data || []
  const customerData = selectedInvoiceData ? customers.find((c: any) => c.phone === selectedInvoiceData.customer_phone || c.name === selectedInvoiceData.customer) : null

  const chartData = [
    { day: 'Mon', revenue: 22000 },
    { day: 'Tue', revenue: 28000 },
    { day: 'Wed', revenue: 19000 },
    { day: 'Thu', revenue: 31000 },
    { day: 'Fri', revenue: 28456 },
    { day: 'Sat', revenue: 35000 },
    { day: 'Sun', revenue: 42000 },
  ]

  const stats = [
    { title: "Today's Revenue", value: formatCurrency(28456), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Monthly Revenue', value: formatCurrency(285000), icon: FileText, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { title: 'Total Invoices', value: '1,842', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Avg Bill Value', value: formatCurrency(845), icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' }
  ]

  const paymentMethods = [
    { name: 'Cash', percentage: 35, amount: 9960, icon: Banknote, color: 'bg-emerald-500' },
    { name: 'UPI', percentage: 45, amount: 12805, icon: Smartphone, color: 'bg-primary-500' },
    { name: 'Card', percentage: 12, amount: 3415, icon: CreditCard, color: 'bg-amber-500' },
    { name: 'Credit', percentage: 8, amount: 2276, icon: FileText, color: 'bg-rose-500' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="badge badge-success text-[10px] uppercase">Paid</span>
      case 'credit': return <span className="badge badge-info text-[10px] uppercase">Credit</span>
      case 'partial': return <span className="badge badge-warning text-[10px] uppercase">Partial</span>
      default: return null
    }
  }

  const getPaymentIcon = (method: string) => {
    switch(method) {
      case 'cash': return <Banknote className="w-4 h-4 text-emerald-500" />
      case 'upi': return <Smartphone className="w-4 h-4 text-primary-500" />
      case 'card': return <CreditCard className="w-4 h-4 text-amber-500" />
      case 'credit': return <FileText className="w-4 h-4 text-rose-500" />
      default: return null
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)] -m-2 p-2">
      <div className={`flex-1 overflow-y-auto space-y-6 pr-2 ${selectedInvoice ? 'hidden xl:block xl:w-2/3' : 'w-full'}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-header flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              Sales Management
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm font-medium">
              <span style={{ color: 'var(--text-muted)' }}>Today: <span className="text-emerald-500">₹28,456</span></span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span style={{ color: 'var(--text-muted)' }}>Month: <span className="text-primary-500">₹2,85,000</span></span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span className="text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.4%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border flex items-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Invoice
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={stat.title} className="card p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="section-title mb-4">Weekly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-floating)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'var(--card-bg)' }} activeDot={{ r: 6, fill: '#10b981', stroke: 'white', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.name}>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="flex items-center gap-2">
                      <method.icon className={`w-4 h-4 ${method.color.replace('bg-', 'text-')}`} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{method.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>{formatCurrency(method.amount)}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{method.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${method.color}`} style={{ width: `${method.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="card overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b bg-gray-50/50 dark:bg-gray-800/30" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('invoices')}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Recent Invoices
              </button>
              <button 
                onClick={() => setActiveTab('returns')}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${activeTab === 'returns' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Returns / Credit Notes
              </button>
            </div>
            <div className="relative w-48 hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Search invoices..." 
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border outline-none focus:border-primary-500"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'invoices' ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b" style={{ borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase">Invoice #</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase">Customer</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase">Date</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase text-center">Items</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase text-right">Amount</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase text-center">Status</th>
                    <th className="p-3 font-semibold text-xs text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {salesInvoices.map((inv: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={inv.originalId} 
                      className={`transition-colors cursor-pointer ${selectedInvoice === inv.originalId ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/20'}`}
                      onClick={() => setSelectedInvoice(inv.originalId)}
                    >
                      <td className="p-3 font-medium text-primary-600 dark:text-primary-400">{inv.id}</td>
                      <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>{inv.customer}</td>
                      <td className="p-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(inv.date)}</td>
                      <td className="p-3 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>{inv.items}</td>
                      <td className="p-3 text-right">
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(inv.amount)}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {getPaymentIcon(inv.paymentMethod)}
                          <span className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>{inv.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">{getStatusBadge(inv.status)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 text-gray-400 hover:text-primary-500 rounded-md hover:bg-primary-50 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"><Printer className="w-4 h-4" /></button>
                          <button className="p-1.5 text-gray-400 hover:text-rose-500 rounded-md hover:bg-rose-50 transition-colors"><ArrowRightLeft className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No returns recorded today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Detail Side Panel */}
      <AnimatePresence>
        {selectedInvoice && selectedInvoiceData && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full xl:w-1/3 card h-full flex flex-col shadow-floating"
            style={{ zIndex: 10 }}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Invoice {selectedInvoiceData.id}</h3>
                <p className="text-xs flex items-center gap-2 mt-1" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(selectedInvoiceData.date)} <span className="w-1 h-1 rounded-full bg-gray-300"></span> {getStatusBadge(selectedInvoiceData.status)}
                </p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Bill To */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Bill To</p>
                {customerData ? (
                  <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{customerData.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{customerData.phone} | {customerData.email}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{customerData.address}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Walk-in Customer</p>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Items ({selectedInvoiceData.items})</p>
                <div className="space-y-2">
                  {[1, 2, 3].slice(0, selectedInvoiceData.items).map((_, i) => (
                    <div key={i} className="flex justify-between items-start py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{i === 0 ? 'Paracetamol 500mg' : i === 1 ? 'Amoxicillin 500mg' : 'Vitamin D3'}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{i===0 ? '2 strips' : '1 strip'} x {formatCurrency(i===0?20:78)}</p>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(i===0?40:i===1?78:85)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedInvoiceData.amount * 0.88)}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>CGST (6%)</span>
                  <span>{formatCurrency(selectedInvoiceData.amount * 0.06)}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>SGST (6%)</span>
                  <span>{formatCurrency(selectedInvoiceData.amount * 0.06)}</span>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">Grand Total</span>
                  <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-primary">{formatCurrency(selectedInvoiceData.amount)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex gap-3 bg-white dark:bg-[#111118]" style={{ borderColor: 'var(--border)' }}>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <ArrowRightLeft className="w-4 h-4" /> Return
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
