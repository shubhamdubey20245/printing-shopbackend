import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Search, Plus, Download, Upload, Filter,
  MoreVertical, Edit, AlertTriangle, Layers, LayoutGrid, List, Trash2
} from 'lucide-react'
import type { Medicine } from '@/types'
import { getDaysUntilExpiry, getExpiryStatus, formatCurrency, formatDate } from '@/utils/cn'
import { useMedicines, useCreateMedicine, useUpdateMedicine, useDeleteMedicine } from '@/hooks/useMedicines'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import MedicineForm from '@/components/inventory/MedicineForm'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

export default function Inventory() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  
  const { addToast } = useToast()

  const { data: response, isLoading: loading, isFetching } = useMedicines()
  const queryClient = useQueryClient()
  const createMutation = useCreateMedicine()
  const updateMutation = useUpdateMedicine()
  const deleteMutation = useDeleteMedicine()

  const rawMedicines = response?.data || []
  const medicines = useMemo(() => rawMedicines.map((m: any) => ({
    id: m.id,
    name: m.name,
    category: m.Category?.name || 'Uncategorized',
    batchNo: m.batch_number,
    stock: m.stock_quantity,
    minStock: m.minimum_stock,
    price: m.selling_price,
    sellingPrice: m.selling_price,
    expiryDate: m.expiry_date,
    supplier: m.manufacturer || 'Unknown',
    mrp: m.mrp,
    genericName: m.generic_name
  })), [rawMedicines])

  const categoriesList = useMemo(() => ['All', ...Array.from(new Set(medicines.map((m: any) => m.category)))] as string[], [medicines])

  const handleCreateOrUpdate = async (data: Partial<Medicine>) => {
    try {
      const payload: any = {
        name: data.name,
        generic_name: data.genericName,
        manufacturer: data.manufacturer,
        batch_number: data.batchNo,
        purchase_price: data.purchasePrice,
        selling_price: data.sellingPrice,
        mrp: data.mrp,
        gst_percentage: data.gstRate,
        stock_quantity: data.stock,
        minimum_stock: data.minStock,
        expiry_date: data.expiryDate,
        barcode: data.barcode,
      }

      if (selectedMedicine) {
        await updateMutation.mutateAsync({ id: selectedMedicine.id, data: payload })
        addToast({ type: 'success', title: 'Success', message: 'Medicine updated successfully' })
      } else {
        await createMutation.mutateAsync(payload)
        addToast({ type: 'success', title: 'Success', message: 'Medicine added successfully' })
      }
      setIsFormOpen(false)
      setSelectedMedicine(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save medicine' })
    }
  }

  const handleDelete = async () => {
    if (!selectedMedicine) return
    try {
      await deleteMutation.mutateAsync(selectedMedicine.id)
      addToast({ type: 'success', title: 'Success', message: 'Medicine deleted successfully' })
      setIsDeleteOpen(false)
      setSelectedMedicine(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete medicine' })
    }
  }

  const openEdit = (med: Medicine) => {
    setSelectedMedicine(med)
    setIsFormOpen(true)
  }

  const openDelete = (med: Medicine) => {
    setSelectedMedicine(med)
    setIsDeleteOpen(true)
  }

  const filteredMedicines = useMemo(() => medicines.filter((m: any) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.batchNo.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesCategory = false;
    if (categoryFilter === 'All') matchesCategory = true;
    else if (categoryFilter === 'Low Stock') matchesCategory = m.stock < m.minStock && m.stock > 0;
    else if (categoryFilter === 'Near Expiry') matchesCategory = getDaysUntilExpiry(m.expiryDate) <= 90;
    else if (categoryFilter === 'Negative Stock') matchesCategory = m.stock < 0;
    else matchesCategory = m.category === categoryFilter;

    return matchesSearch && matchesCategory
  }), [medicines, searchQuery, categoryFilter])

  const stats = useMemo(() => ({
    totalSkus: medicines.length,
    lowStockCount: medicines.filter((m: any) => m.stock < m.minStock && m.stock > 0).length,
    outOfStockCount: medicines.filter((m: any) => m.stock === 0).length,
    nearExpiryCount: medicines.filter((m: any) => getDaysUntilExpiry(m.expiryDate) <= 90).length,
    negativeStockCount: medicines.filter((m: any) => m.stock < 0).length
  }), [medicines])

  const { totalSkus, lowStockCount, outOfStockCount, nearExpiryCount, negativeStockCount } = stats

  const getStockColor = (stock: number, min: number) => {
    if (stock === 0) return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-200'
    if (stock < min) return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200'
    return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200'
  }

  const getExpiryBadge = (dateStr: string) => {
    const status = getExpiryStatus(getDaysUntilExpiry(dateStr))
    if (status === 'expired') return <span className="badge badge-danger text-[10px]">Expired</span>
    if (status === 'critical') return <span className="badge badge-danger text-[10px]">Expiring soon</span>
    if (status === 'warning') return <span className="badge badge-warning text-[10px]">Near Expiry</span>
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary-500" />
            Inventory Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {totalSkus} SKUs • <span className="text-amber-500">{lowStockCount} Low Stock</span> • <span className="text-rose-500">{nearExpiryCount} Near Expiry</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setSelectedMedicine(null); setIsFormOpen(true); }} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
          <button className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 bg-white dark:bg-gray-800 border transition-all hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 bg-white dark:bg-gray-800 border transition-all hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total SKUs', value: totalSkus, icon: Package, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20', filterVal: 'All' },
          { title: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', filterVal: 'Low Stock' },
          { title: 'Near Expiry (90d)', value: nearExpiryCount, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', filterVal: 'Near Expiry' },
          { title: 'Negative Stock', value: negativeStockCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', filterVal: 'Negative Stock' }
        ].map(stat => (
          <div 
            key={stat.title} 
            onClick={() => setCategoryFilter(stat.filterVal)}
            className={`card p-4 flex items-center gap-4 cursor-pointer transition-all ${categoryFilter === stat.filterVal ? 'ring-2 ring-primary-500 shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-2 flex flex-col md:flex-row gap-3 justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search inventory..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 border outline-none focus:border-primary-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-gray-500 hover:text-primary-500 transition-colors" style={{ borderColor: 'var(--border)' }}>
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['medicines'] })}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-gray-500 hover:text-primary-500 transition-colors" 
            style={{ borderColor: 'var(--border)' }}
            title="Refresh"
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full md:w-auto">
            {categoriesList.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${categoryFilter === category ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
          
          <div className="flex gap-1 bg-white dark:bg-gray-900 border rounded-lg p-1" style={{ borderColor: 'var(--border)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredMedicines.map((med: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={med.id} 
                className="card p-4 flex flex-col group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-6">
                    <h3 className="font-bold text-[15px] leading-tight" style={{ color: 'var(--text-primary)' }}>{med.name}</h3>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{med.genericName}</p>
                  </div>
                  {getExpiryBadge(med.expiryDate)}
                </div>
                
                <div className="text-[11px] mb-4 space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <p>Category: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{med.category}</span></p>
                  <p>Batch: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{med.batchNo}</span></p>
                  <p>Expiry: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(med.expiryDate)}</span></p>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Stock Level</p>
                      <p className={`text-sm font-bold mt-0.5 ${med.stock <= med.minStock ? (med.stock === 0 ? 'text-rose-500' : 'text-amber-500') : 'text-emerald-500'}`}>
                        {med.stock} <span className="text-xs font-normal">units</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>MRP / Selling</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        <span className="line-through text-xs text-gray-400 font-normal mr-1">{formatCurrency(med.mrp)}</span>
                        {formatCurrency(med.sellingPrice)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${med.stock <= med.minStock ? (med.stock === 0 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (med.stock / (med.minStock * 3)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => openEdit(med as Medicine)} className="w-7 h-7 rounded-lg bg-white shadow-md border flex items-center justify-center text-gray-500 hover:text-primary-500">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => openDelete(med as Medicine)} className="w-7 h-7 rounded-lg bg-white shadow-md border flex items-center justify-center text-gray-500 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b" style={{ borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Batch & Expiry</th>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Stock</th>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Price</th>
                    <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {filteredMedicines.map((med: any, i: number) => (
                    <motion.tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{med.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{med.genericName}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {med.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{med.batchNo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(med.expiryDate)}</p>
                          {getExpiryBadge(med.expiryDate)}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`inline-flex px-2.5 py-1 rounded-lg border font-bold text-sm ${getStockColor(med.stock, med.minStock)}`}>
                          {med.stock}
                        </div>
                        {med.stock <= med.minStock && med.stock > 0 && <p className="text-[10px] text-amber-500 mt-1 font-medium">Low Stock</p>}
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(med.sellingPrice)}</p>
                        <p className="text-[10px] line-through mt-0.5" style={{ color: 'var(--text-muted)' }}>MRP: {formatCurrency(med.mrp)}</p>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEdit(med as Medicine)} className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDelete(med as Medicine)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedMedicine ? "Edit Medicine" : "Add Medicine"} size="lg">
        <MedicineForm 
          initialData={selectedMedicine || undefined} 
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Medicine"
        message={`Are you sure you want to delete ${selectedMedicine?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
