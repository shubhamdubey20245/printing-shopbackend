import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Receipt, Package, Users, TrendingUp, Scan,
  DollarSign, Clock, AlertTriangle, ChevronRight,
  Upload, Camera, FileText, CheckCircle2
} from 'lucide-react'
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts'
import { formatCurrency, getDaysUntilExpiry, formatDate } from '@/utils/cn'
import { useCountUp } from '@/hooks/useCountUp'
import api from '@/lib/api'

// --- Reusable Components ---

function KPICard({ title, value, trend, trendValue, icon: Icon, colorClass, isCurrency = true, isNegativeBad = true }: any) {
  const isUp = trend === 'up'
  const isGood = isNegativeBad ? isUp : !isUp
  
  return (
    <div className="card p-5 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.04] transition-transform group-hover:scale-150 ${colorClass.split(' ')[0]}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {isCurrency ? formatCurrency(value) : value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${isGood ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
          {trendValue}
        </div>
        <span className="text-[10px] font-medium text-gray-400">vs last month</span>
      </div>
    </div>
  )
}

function SectionHeader({ title, icon: Icon, actionLabel, onAction, colorClass }: any) {
  return (
    <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {actionLabel && (
        <button onClick={onAction} className="text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors flex items-center group">
          {actionLabel} <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}

// --- Main Page ---

export default function Dashboard() {
  const navigate = useNavigate()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  // State
  const [stats, setStats] = useState({ todaysSales: 0, monthlyRevenue: 0, pendingPayments: 0 })
  const [recentBills, setRecentBills] = useState<any[]>([])
  const [expiringMedicines, setExpiringMedicines] = useState<any[]>([])
  const [topMedicines, setTopMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, billsRes, expiringRes, topRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent-bills'),
          api.get('/dashboard/expiring-medicines'),
          api.get('/dashboard/top-selling')
        ]);
        
        setStats(statsRes.data.data);
        
        // Format bills to match UI
        setRecentBills(billsRes.data.data.map((b: any) => ({
          id: b.invoice_number,
          customer: b.Customer?.name || 'Walk-in',
          date: b.created_at,
          amount: b.total_amount,
          status: b.payment_method === 'CASH' ? 'paid' : 'credit'
        })));

        // Format expiring
        setExpiringMedicines(expiringRes.data.data.map((m: any) => ({
          id: m.id,
          name: m.name,
          batchNo: m.batch_number,
          expiryDate: m.expiry_date,
          daysUntilExpiry: getDaysUntilExpiry(m.expiry_date)
        })));

        // Format top selling
        setTopMedicines(topRes.data.data.map((t: any) => ({
          id: t.medicine_id,
          name: t.Medicine?.name || 'Unknown',
          sales: Number(t.totalSold)
        })));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const expiringCount = expiringMedicines.length

  const quickActions = [
    { label: 'New Bill', icon: Receipt, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', hover: 'hover:border-emerald-500 hover:shadow-emerald-500/10', to: '/billing' },
    { label: 'Add Stock', icon: Package, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20', hover: 'hover:border-primary-500 hover:shadow-primary-500/10', to: '/inventory' },
    { label: 'Add Customer', icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', hover: 'hover:border-blue-500 hover:shadow-blue-500/10', to: '/customers' },
    { label: 'View Reports', icon: TrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', hover: 'hover:border-amber-500 hover:shadow-amber-500/10', to: '/reports' },
    { label: 'Scanner', icon: Scan, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20', hover: 'hover:border-violet-500 hover:shadow-violet-500/10', to: '/ai-center' },
  ]

  const getPriorityColor = (days: number) => {
    if (days < 0) return 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
    if (days <= 30) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900">Paid</span>
      case 'credit': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900">Credit</span>
      case 'partial': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900">Partial</span>
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      
      {/* Header */}
      <div>
        <h1 className="page-header">{greeting}, Rajesh</h1>
        <p className="text-sm mt-1 font-medium text-gray-500 dark:text-gray-400">
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* 1. Quick Actions */}
      <div className="grid grid-cols-5 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className={`card p-4 flex flex-col items-center justify-center transition-all duration-300 border-2 border-transparent ${action.hover} hover:-translate-y-1 shadow-sm`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-bold text-[13px] tracking-wide" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* 2. KPI Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Today's Sales" value={stats.todaysSales} trend="up" trendValue="12.4%" 
          icon={DollarSign} colorClass="bg-emerald-500 text-emerald-50 dark:bg-emerald-600" 
        />
        <KPICard 
          title="Monthly Revenue" value={stats.monthlyRevenue} trend="up" trendValue="8.2%" 
          icon={TrendingUp} colorClass="bg-primary-500 text-primary-50 dark:bg-primary-600" 
        />
        <KPICard 
          title="Pending Payments" value={stats.pendingPayments} trend="down" trendValue="4.1%" 
          icon={Clock} colorClass="bg-amber-500 text-amber-50 dark:bg-amber-600" 
          isNegativeBad={false}
        />
        <KPICard 
          title="Expiring Medicines" value={expiringCount} trend="down" trendValue="2" 
          icon={AlertTriangle} colorClass="bg-rose-500 text-rose-50 dark:bg-rose-600" 
          isCurrency={false} isNegativeBad={false}
        />
      </div>

      {/* 3. Recent Bills & Expiring Medicines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Generated Bills */}
        <div className="card flex flex-col min-h-[380px]">
          <SectionHeader 
            title="Recent Generated Bills" icon={Receipt} colorClass="bg-primary-50 text-primary-600 dark:bg-primary-900/30"
            actionLabel="View All" onAction={() => navigate('/sales')} 
          />
          <div className="flex-1 p-2">
            <div className="space-y-2">
              {recentBills.map(bill => (
                <div key={bill.id} className="p-3 rounded-xl border flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{bill.customer}</p>
                      <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                        {bill.id.toUpperCase().replace('INV', 'INV-')} • {formatDate(bill.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
                    <p className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(bill.amount)}</p>
                    {getStatusBadge(bill.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expiring Medicines */}
        <div className="card flex flex-col min-h-[380px]">
          <SectionHeader 
            title="Expiring Medicines" icon={AlertTriangle} colorClass="bg-rose-50 text-rose-600 dark:bg-rose-900/30"
            actionLabel="Manage Inventory" onAction={() => navigate('/inventory')} 
          />
          <div className="flex-1 p-2">
            {expiringMedicines.length > 0 ? (
              <div className="space-y-2">
                {expiringMedicines.map(med => (
                  <div key={med.id} className="p-3 rounded-xl border flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{med.name}</p>
                      <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                        Batch: {med.batchNo} • Exp: {formatDate(med.expiryDate)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(med.daysUntilExpiry)}`}>
                        {med.daysUntilExpiry < 0 ? 'Expired' : med.daysUntilExpiry <= 30 ? 'Critical' : 'Warning'}
                      </span>
                      <span className="text-[10px] font-bold mt-1.5" style={{ color: med.daysUntilExpiry < 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {med.daysUntilExpiry < 0 ? 'Action Required' : `${med.daysUntilExpiry} days left`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-400" />
                <p className="font-medium text-[15px]">Inventory is secure</p>
                <p className="text-sm mt-1 text-gray-400">No medicines expiring in the next 90 days.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Top Selling & Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Medicines */}
        <div className="card flex flex-col min-h-[380px]">
          <SectionHeader 
            title="Top Selling Medicines" icon={TrendingUp} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30"
            actionLabel="View Analytics" onAction={() => navigate('/reports')} 
          />
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-end mb-2">
              <select className="text-xs bg-gray-50 border p-1.5 rounded-lg outline-none cursor-pointer dark:bg-gray-800" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMedicines.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-primary)', fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: 'rgba(99,102,241,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-floating)', fontSize: '12px', fontWeight: 600 }} />
                  <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Prescription Scanner Widget */}
        <div className="card flex flex-col min-h-[380px]">
          <SectionHeader 
            title="Prescription Scanner" icon={Scan} colorClass="bg-violet-50 text-violet-600 dark:bg-violet-900/30"
            actionLabel="Open AI Center" onAction={() => navigate('/ai-center')} 
          />
          <div className="p-6 flex-1 flex flex-col justify-center">
            
            <div className="w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 hover:border-violet-400 transition-colors cursor-pointer group" style={{ borderColor: 'var(--border)' }}>
              <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Drop prescription image here</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG, PDF</p>
              
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-1.5 rounded-lg border font-semibold text-xs flex items-center gap-2 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <Upload className="w-3.5 h-3.5" /> Browse
                </button>
                <button className="px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-2 bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-sm">
                  <Camera className="w-3.5 h-3.5" /> Use Camera
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Recent Scans</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-24 rounded-xl border bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 flex items-center justify-center relative group cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                    <FileText className="w-6 h-6 text-gray-400" />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Scan className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
