import { motion } from 'framer-motion'
import { 
  FileText, Plus, Upload, TrendingUp, AlertCircle, Package, Download, Eye, CheckCircle2
} from 'lucide-react'
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts'
import { formatCurrency, formatDate } from '@/utils/cn'
import { usePurchases, useReceivePurchase } from '@/hooks/usePurchases'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'

export default function Purchases() {
  const { data: response } = usePurchases()
  const receiveMutation = useReceivePurchase()
  const { addToast } = useToast()
  
  const purchaseOrders = (response?.data || []).map((po: any) => ({
    id: po.id,
    invoiceNo: `PO-${po.id.substring(0,6).toUpperCase()}`,
    supplier: po.Supplier?.name || 'Unknown Supplier',
    items: po.items?.length || 0,
    date: po.createdAt || po.created_at || new Date().toISOString(),
    totalAmount: po.total_amount,
    status: po.status.toLowerCase(),
  }))

  const suppliers: any[] = [] // We'd fetch this from useSuppliers if needed for the top suppliers widget, leaving empty for now to focus on core logic

  const handleReceive = async (id: string) => {
    try {
      await receiveMutation.mutateAsync(id)
      addToast({ type: 'success', title: 'Success', message: 'Purchase Order marked as received' })
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to receive purchase order' })
    }
  }

  const chartData = [
    { month: 'Jan', amount: 145000 },
    { month: 'Feb', amount: 162000 },
    { month: 'Mar', amount: 130000 },
    { month: 'Apr', amount: 185000 },
    { month: 'May', amount: 205000 },
    { month: 'Jun', amount: 190000 },
  ]

  const stats = [
    { title: 'Purchased This Month', value: formatCurrency(285000), icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { title: 'Pending Orders', value: '3', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { title: 'Top Supplier', value: 'Sun Pharma', icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Avg Order Value', value: formatCurrency(52000), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" />
            Purchase Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Total Orders: 48 • Pending: 3 • This Month: <span className="font-medium text-emerald-500">₹2,85,000</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border flex items-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <Upload className="w-4 h-4" /> Import Invoice
          </button>
          <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Purchase Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title} 
            className="card p-5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
              <p className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Suppliers */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Chart */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Purchase Analytics</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip cursor={{ fill: 'rgba(99,102,241,0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-floating)' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Suppliers */}
          <div className="card p-5 flex-1">
            <h3 className="section-title mb-4">Top Suppliers</h3>
            <div className="space-y-3">
              {suppliers.slice(0, 4).map(s => (
                <div key={s.id} className="p-3 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between hover:border-primary-300 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last order: {formatDate(s.lastOrder)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-rose-500 font-medium">Due: {formatCurrency(s.outstanding)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Orders Table */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          <div className="p-5 border-b flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30" style={{ borderColor: 'var(--border)' }}>
            <h3 className="section-title">Recent Purchase Orders</h3>
            <button className="text-xs font-medium text-primary-500 hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b" style={{ borderColor: 'var(--border)' }}>
                <tr>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase">PO Number</th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase">Supplier</th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase">Date</th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">Amount</th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-center">Status</th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {purchaseOrders.map((po: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={po.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{po.invoiceNo}</td>
                    <td className="p-4">
                      <p className="font-medium truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>{po.supplier}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{po.items} items</p>
                    </td>
                    <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(po.date)}</td>
                    <td className="p-4 text-right font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(po.totalAmount)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        po.status === 'received' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        po.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-primary-500 rounded-md hover:bg-primary-50 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {po.status !== 'received' && (
                          <button onClick={() => handleReceive(po.id)} className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-md hover:bg-emerald-50 transition-colors" title="Mark Received">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
