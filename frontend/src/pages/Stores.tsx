import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, ArrowRightLeft, Building2, Package, TrendingUp } from 'lucide-react'
import { stores } from '@/data/mockData'
import { formatCurrency } from '@/utils/cn'

export default function Stores() {
  const [activeTab, setActiveTab] = useState('stores')

  const topStoreValue = Math.max(...stores.map(s => s.revenue))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-500" />
            Store Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {stores.length} Stores • Total Revenue: <span className="font-medium text-emerald-500">₹8,40,000</span>
          </p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Store
        </button>
      </div>

      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        <button 
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'stores' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Store Performance
        </button>
        <button 
          onClick={() => setActiveTab('transfers')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'transfers' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Inter-Store Transfers
        </button>
      </div>

      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={store.id} 
              className="card p-6 group hover:border-primary-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    {store.name}
                  </h3>
                  <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-3.5 h-3.5" /> {store.location}
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary-50 text-primary-600 dark:bg-primary-900/30 rounded-lg text-xs font-bold uppercase">
                  {store.manager}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Monthly Revenue</p>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-primary">
                    {formatCurrency(store.revenue)}
                  </p>
                  <p className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> 12%</p>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${(store.revenue / topStoreValue) * 100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sales</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>1,452</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Inventory</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>450 SKUs</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="card p-8 text-center text-gray-500">
          <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-primary-200" />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No active transfers</h3>
          <p className="text-sm max-w-md mx-auto mb-6">Move inventory between your branches easily. All transfers are tracked automatically.</p>
          <button className="btn-primary px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Initiate Transfer
          </button>
        </div>
      )}
    </div>
  )
}
