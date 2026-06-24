import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, Plus, Star, Phone, Mail, MapPin, 
  Clock, ArrowUpRight, CheckCircle2, ChevronRight, X, AlertCircle, FileText,
  Edit, Trash2
} from 'lucide-react'
import type { Customer } from '@/types'
import { formatCurrency, formatDate } from '@/utils/cn'
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useCustomers'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import CustomerForm from '@/components/customers/CustomerForm'
import { useToast } from '@/hooks/useToast'

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const { addToast } = useToast()

  const { data: response, isLoading: loading } = useCustomers()
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  const rawCustomers = response?.data || []
  const customers = useMemo(() => rawCustomers.map((c: any) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email || '',
    address: c.address || '',
    type: c.type || 'regular',
    loyaltyPoints: 0,
    totalPurchases: 0,
    outstandingAmount: 0,
    lastPurchase: new Date().toISOString()
  })), [rawCustomers])

  const selectedCustomerData = selectedCustomer ? customers.find((c: any) => c.id === selectedCustomer) : null

  const handleCreateOrUpdate = async (data: Partial<Customer>) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({ id: editingCustomer.id, data })
        addToast({ type: 'success', title: 'Success', message: 'Customer updated successfully' })
      } else {
        await createMutation.mutateAsync(data)
        addToast({ type: 'success', title: 'Success', message: 'Customer added successfully' })
      }
      setIsFormOpen(false)
      setEditingCustomer(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save customer' })
    }
  }

  const handleDelete = async () => {
    if (!editingCustomer) return
    try {
      await deleteMutation.mutateAsync(editingCustomer.id)
      addToast({ type: 'success', title: 'Success', message: 'Customer deleted successfully' })
      setIsDeleteOpen(false)
      setSelectedCustomer(null)
      setEditingCustomer(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete customer' })
    }
  }

  const openEdit = (customer: any) => {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  const openDelete = (customer: any) => {
    setEditingCustomer(customer)
    setIsDeleteOpen(true)
  }

  const filteredCustomers = useMemo(() => customers.filter((c: any) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
    const matchFilter = filterType === 'All' || c.type === filterType.toLowerCase()
    return matchSearch && matchFilter
  }), [customers, searchQuery, filterType])

  const stats = useMemo(() => ({
    totalOutstanding: customers.reduce((sum: number, c: any) => sum + c.outstandingAmount, 0),
    premiumCount: customers.filter((c: any) => c.type === 'premium').length,
    wholesaleCount: customers.filter((c: any) => c.type === 'wholesale').length
  }), [customers])

  const { totalOutstanding, premiumCount, wholesaleCount } = stats

  const getTypeColor = (type: string) => {
    if (type === 'premium') return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200'
    if (type === 'wholesale') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200'
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
  }

  const getTypeGradient = (type: string) => {
    if (type === 'premium') return 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-primary'
    if (type === 'wholesale') return 'bg-gradient-info shadow-md'
    return 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-md'
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)] -m-2 p-2">
      <div className={`flex-1 overflow-y-auto space-y-6 pr-2 ${selectedCustomer ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-header flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-500" />
              Customers
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Total: 324 • Premium: <span className="text-violet-500 font-medium">{premiumCount}</span> • Wholesale: <span className="text-blue-500 font-medium">{wholesaleCount}</span>
            </p>
          </div>
          <button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>

        {/* Highlight Card */}
        <div className="card bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10 p-4 flex items-center justify-between border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
              <AlertCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Total Outstanding Due</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-rose-600 shadow-sm hover:shadow-md transition-all">
            Send Reminders
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name or phone..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-gray-900 border outline-none focus:border-primary-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex gap-1 w-full sm:w-auto bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
            {['All', 'Regular', 'Premium', 'Wholesale'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === type ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          <AnimatePresence>
            {filteredCustomers.map((customer: any, i: number) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className={`card p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-card-hover group border-2 ${selectedCustomer === customer.id ? 'border-primary-400 dark:border-primary-600' : 'border-transparent'}`}
                style={selectedCustomer !== customer.id ? { borderColor: 'var(--border)' } : {}}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${getTypeGradient(customer.type)}`}>
                    {customer.name.charAt(0)}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(customer.type)}`}>
                    {customer.type}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{customer.name}</h3>
                <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <Phone className="w-3 h-3" /> {customer.phone}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-gray-400">Total Purchase</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{formatCurrency(customer.totalPurchases)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-semibold text-gray-400">Outstanding</p>
                    <p className={`font-bold text-sm mt-0.5 ${customer.outstandingAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {formatCurrency(customer.outstandingAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1 font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {customer.loyaltyPoints} pts
                  </div>
                  <div className="text-primary-500 font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedCustomer && selectedCustomerData && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full lg:w-1/3 card h-full flex flex-col shadow-floating"
            style={{ zIndex: 10 }}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Customer Profile</h3>
                <button onClick={() => openEdit(selectedCustomerData)} className="p-1.5 ml-2 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(selectedCustomerData)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mb-3 ${getTypeGradient(selectedCustomerData.type)}`}>
                  {selectedCustomerData.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedCustomerData.name}</h2>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getTypeColor(selectedCustomerData.type)}`}>
                  {selectedCustomerData.type} Member
                </span>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 space-y-3 border" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><Phone className="w-4 h-4" /></div>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCustomerData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><Mail className="w-4 h-4" /></div>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCustomerData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><MapPin className="w-4 h-4" /></div>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCustomerData.address}</span>
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4 text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(selectedCustomerData.totalPurchases)}</p>
                </div>
                <div className={`card p-4 text-center ${selectedCustomerData.outstandingAmount > 0 ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10'}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: selectedCustomerData.outstandingAmount > 0 ? '#e11d48' : '#059669' }}>Outstanding</p>
                  <p className={`text-lg font-bold ${selectedCustomerData.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatCurrency(selectedCustomerData.outstandingAmount)}
                  </p>
                </div>
              </div>

              {/* Loyalty */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-500">Loyalty Points</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 leading-none mt-1">{selectedCustomerData.loyaltyPoints}</p>
                </div>
                <button className="ml-auto px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm">Redeem</button>
              </div>

              {/* Recent Purchases */}
              <div>
                <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-gray-400">Recent Invoices</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>INV-18{40-i}</p>
                          <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <Clock className="w-3 h-3" /> {formatDate(selectedCustomerData.lastPurchase)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(i===1?1250:i===2?450:890)}</p>
                        <p className="text-[10px] text-emerald-500 font-medium">Paid</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button className="w-full btn-primary py-3 rounded-xl flex justify-center items-center gap-2">
                <Plus className="w-4 h-4" /> Create New Bill
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingCustomer ? "Edit Customer" : "Add Customer"} size="md">
        <CustomerForm 
          initialData={editingCustomer || undefined} 
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${editingCustomer?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

function AlertCircleIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
