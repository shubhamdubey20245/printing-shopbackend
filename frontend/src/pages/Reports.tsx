import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts'
import { 
  Download as DownloadIcon, Printer as PrinterIcon, Calendar as CalendarIcon, Filter,
  BarChart2, PieChart as PieChartIcon, TrendingUp, Download, Printer, 
  Calendar, ChevronDown, Package, FileText, Activity 
} from 'lucide-react'
import { formatCurrency } from '@/utils/cn'
import api from '@/lib/api'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales')
  const [dateRange, setDateRange] = useState('This Month')

  const tabs = [
    { id: 'sales', label: 'Sales & Revenue' },
    { id: 'gst', label: 'GST & Taxes' },
    { id: 'inventory', label: 'Inventory Valuation' },
  ]

  const [salesData, setSalesData] = useState<any[]>([])
  const [gstData, setGstData] = useState<any[]>([])
  const [inventoryData, setInventoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const categoryData = [
    { name: 'Antibiotics', value: 35, color: '#6366f1' },
    { name: 'Painkillers', value: 25, color: '#10b981' },
    { name: 'Vitamins', value: 20, color: '#f59e0b' },
    { name: 'Cardio', value: 15, color: '#3b82f6' },
    { name: 'Others', value: 5, color: '#8b5cf6' },
  ]

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesRes, gstRes, invRes] = await Promise.all([
          api.get('/reports/sales'),
          api.get('/reports/gst'),
          api.get('/reports/inventory')
        ]);
        
        // Transform sales data
        setSalesData(salesRes.data.data.map((d: any) => ({
          date: d.date.split('-').reverse().slice(0, 2).join(' '),
          revenue: Number(d.totalRevenue)
        })));
        
        setGstData(gstRes.data.data);
        setInventoryData(invRes.data.data);
      } catch (error) {
        console.error('Failed to load reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="card px-3 py-2 text-xs space-y-1 shadow-floating border-none">
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-header">Reports & Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Comprehensive business intelligence and tax reports</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border flex items-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <PrinterIcon className="w-4 h-4" /> Print
          </button>
          <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
            <DownloadIcon className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-2 flex flex-col md:flex-row gap-2 justify-between bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 md:flex-none ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border outline-none cursor-pointer appearance-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range...</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Sales', value: formatCurrency(285000), trend: '+12.5%' },
                { title: 'Total Invoices', value: '1,842', trend: '+5.2%' },
                { title: 'Avg Bill Value', value: formatCurrency(845), trend: '+2.1%' },
                { title: 'Net Profit', value: formatCurrency(95000), trend: '+15.3%' },
              ].map((stat, i) => (
                <div key={i} className="card p-5 border-t-4 border-t-primary-500">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{stat.title}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-5">
                <h3 className="section-title mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-5">
                <h3 className="section-title mb-4">Top Selling Categories</h3>
                <div className="flex items-center h-[300px]">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-[50%] pl-4 space-y-4">
                    {categoryData.map((cat: any) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            {cat.name}
                          </span>
                          <span className="font-bold">{cat.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <div className="h-full rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gst' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-[#111118] border-indigo-100 dark:border-indigo-900/30">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500 mb-2">Total Taxable Amount</p>
                <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">{formatCurrency(254464)}</p>
              </div>
              <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-[#111118] border-emerald-100 dark:border-emerald-900/30">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500 mb-2">Total CGST Collected</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(15268)}</p>
              </div>
              <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-[#111118] border-emerald-100 dark:border-emerald-900/30">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500 mb-2">Total SGST Collected</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(15268)}</p>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="p-5 border-b bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <h3 className="section-title">GSTR-1 Summary (B2C & B2B)</h3>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-gray-900 border text-primary-600 shadow-sm" style={{ borderColor: 'var(--border)' }}>Export JSON for Portal</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b" style={{ borderColor: 'var(--border)' }}>
                    <tr>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase">GST Rate</th>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">Taxable Value</th>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">CGST</th>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">SGST</th>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">Total Tax</th>
                      <th className="p-4 font-semibold text-xs text-gray-500 uppercase text-right">Invoice Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {[
                      { rate: '5%', taxable: 45000, cgst: 1125, sgst: 1125, total: 2250, value: 47250 },
                      { rate: '12%', taxable: 185464, cgst: 11127.84, sgst: 11127.84, total: 22255.68, value: 207719.68 },
                      { rate: '18%', taxable: 24000, cgst: 2160, sgst: 2160, total: 4320, value: 28320 },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                        <td className="p-4 font-bold" style={{ color: 'var(--text-primary)' }}>{row.rate}</td>
                        <td className="p-4 text-right">{formatCurrency(row.taxable)}</td>
                        <td className="p-4 text-right text-emerald-600">{formatCurrency(row.cgst)}</td>
                        <td className="p-4 text-right text-emerald-600">{formatCurrency(row.sgst)}</td>
                        <td className="p-4 text-right font-semibold text-primary-600">{formatCurrency(row.total)}</td>
                        <td className="p-4 text-right font-bold">{formatCurrency(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                    <tr>
                      <td className="p-4 uppercase text-xs">Total</td>
                      <td className="p-4 text-right">{formatCurrency(254464)}</td>
                      <td className="p-4 text-right text-emerald-600">{formatCurrency(14412.84)}</td>
                      <td className="p-4 text-right text-emerald-600">{formatCurrency(14412.84)}</td>
                      <td className="p-4 text-right text-primary-600">{formatCurrency(28825.68)}</td>
                      <td className="p-4 text-right">{formatCurrency(283289.68)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
