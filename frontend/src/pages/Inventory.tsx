import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Search, Plus, Filter, RefreshCw, Building2,
  FlaskConical, Tag, ReceiptText, Edit, Trash2, Layers,
  LayoutGrid, List, AlertTriangle, Sparkles, CheckCircle2, X
} from 'lucide-react'
import type { Medicine, PharmaCompany, SaltComposition, HsnSacMaster } from '@/types'
import { getDaysUntilExpiry, getExpiryStatus, formatCurrency, formatDate } from '@/utils/cn'
import { useMedicines, useCreateMedicine, useUpdateMedicine, useDeleteMedicine } from '@/hooks/useMedicines'
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, useSalts, useCreateSalt, useDeleteSalt, useHsnSac, useCreateHsnSac, useDeleteHsnSac } from '@/hooks/useInventoryMasters'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import MedicineForm from '@/components/inventory/MedicineForm'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'

type ActiveTab = 'items' | 'companies' | 'salts' | 'categories' | 'hsn'

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('items')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<any | null>(null)

  // Master Modals state
  const [masterModal, setMasterModal] = useState<ActiveTab | null>(null)
  const [masterForm, setMasterForm] = useState<any>({})

  const { addToast } = useToast()
  const queryClient = useQueryClient()

  // Queries
  const { data: response, isLoading: medLoading, isFetching } = useMedicines()
  const { data: companies = [], isLoading: compLoading } = useCompanies()
  const { data: salts = [], isLoading: saltLoading } = useSalts()
  const { data: hsnList = [], isLoading: hsnLoading } = useHsnSac()
  const { data: categoriesResponse } = useCategories()
  const categories: any[] = categoriesResponse?.data || categoriesResponse || []

  // Medicine Mutations
  const createMutation = useCreateMedicine()
  const updateMutation = useUpdateMedicine()
  const deleteMutation = useDeleteMedicine()

  // Master Mutations
  const createCompanyMut = useCreateCompany()
  const deleteCompanyMut = useDeleteCompany()
  const createSaltMut = useCreateSalt()
  const deleteSaltMut = useDeleteSalt()
  const createHsnMut = useCreateHsnSac()
  const deleteHsnMut = useDeleteHsnSac()
  const createCategoryMut = useCreateCategory()
  const deleteCategoryMut = useDeleteCategory()

  const rawMedicines = response?.data || []
  const medicines = useMemo(() => rawMedicines.map((m: any) => ({
    ...m,
    id: m.id,
    name: m.name,
    category: m.Category?.name || 'Uncategorized',
    batchNo: m.batch_number,
    stock: m.stock_quantity,
    minStock: m.minimum_stock,
    price: m.selling_price,
    sellingPrice: m.selling_price,
    expiryDate: m.expiry_date,
    supplier: m.Company?.name || m.manufacturer || 'Unknown Manufacturer',
    mrp: m.mrp,
    genericName: m.generic_name
  })), [rawMedicines])

  const categoriesList = useMemo(() => ['All', ...Array.from(new Set(medicines.map((m: any) => m.category)))] as string[], [medicines])

  const handleCreateOrUpdate = async (data: Partial<Medicine>) => {
    try {
      const payload: any = {
        ...data,
        name: data.name,
        generic_name: data.genericName,
        manufacturer: data.manufacturer,
        batch_number: data.batchNo,
        purchase_price: data.purchasePrice,
        selling_price: data.sellingPrice || data.rate_a || data.mrp || 0,
        mrp: data.mrp,
        gst_percentage: data.gstRate,
        stock_quantity: data.stock,
        minimum_stock: data.minStock,
        expiry_date: data.expiryDate,
        barcode: data.barcode,
      }

      if (selectedMedicine) {
        await updateMutation.mutateAsync({ id: selectedMedicine.id, data: payload })
        addToast({ type: 'success', title: 'Product Updated', message: 'Marg ERP master updated successfully' })
      } else {
        await createMutation.mutateAsync(payload)
        addToast({ type: 'success', title: 'Product Created', message: 'New SKU registered in Marg ERP inventory' })
      }
      setIsFormOpen(false)
      setSelectedMedicine(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save product master' })
    }
  }

  const handleDelete = async () => {
    if (!selectedMedicine) return
    try {
      await deleteMutation.mutateAsync(selectedMedicine.id)
      addToast({ type: 'success', title: 'Product Deleted', message: 'Item removed from stock' })
      setIsDeleteOpen(false)
      setSelectedMedicine(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete medicine' })
    }
  }

  const filteredMedicines = useMemo(() => medicines.filter((m: any) => {
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.batchNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.packing?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesCategory = false
    if (categoryFilter === 'All') matchesCategory = true
    else if (categoryFilter === 'Low Stock') matchesCategory = m.stock < m.minStock && m.stock > 0
    else if (categoryFilter === 'Near Expiry') matchesCategory = getDaysUntilExpiry(m.expiryDate) <= 90
    else if (categoryFilter === 'Negative Stock') matchesCategory = m.stock < 0
    else matchesCategory = m.category === categoryFilter

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
    if (stock === 0) return 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200'
    if (stock < 0) return 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 font-extrabold'
    if (stock < min) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200'
    return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200'
  }

  const getExpiryBadge = (dateStr: string) => {
    const status = getExpiryStatus(getDaysUntilExpiry(dateStr))
    if (status === 'expired') return <span className="bg-rose-500 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">Expired</span>
    if (status === 'critical') return <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase animate-pulse">Expiring</span>
    if (status === 'warning') return <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">Near Expiry</span>
    return null
  }

  // Master Save Handler
  const handleSaveMaster = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (masterModal === 'companies') {
        await createCompanyMut.mutateAsync(masterForm)
        addToast({ type: 'success', title: 'Company Added', message: `${masterForm.name} manufacturer created!` })
      } else if (masterModal === 'salts') {
        await createSaltMut.mutateAsync(masterForm)
        addToast({ type: 'success', title: 'Salt Added', message: `${masterForm.name} salt registered!` })
      } else if (masterModal === 'categories') {
        await createCategoryMut.mutateAsync(masterForm)
        addToast({ type: 'success', title: 'Category Added', message: `${masterForm.name} category created!` })
      } else if (masterModal === 'hsn') {
        await createHsnMut.mutateAsync(masterForm)
        addToast({ type: 'success', title: 'HSN Added', message: `HSN ${masterForm.hsn_code} saved!` })
      }
      setMasterModal(null)
      setMasterForm({})
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create master entity' })
    }
  }

  if (medLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      
      {/* Marg ERP Styled Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> MARG ERP WORKFLOW
            </span>
            {isFetching && <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">INVENTORY & MASTER CENTER</h1>
          <p className="text-slate-300 text-sm max-w-xl">Manage item inventories, strip/box conversions, tax classifications, and multi-entity master catalogs (Companies, Salts, Categories, HSN).</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button onClick={() => { setSelectedMedicine(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-extrabold px-6 py-3 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2 text-sm transform active:scale-95">
            <Plus className="w-5 h-5" /> NEW PRODUCT MASTER
          </button>
        </div>
      </div>

      {/* Top Level Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {[
          { id: 'items', label: 'Item Master (SKUs)', icon: Package, count: totalSkus },
          { id: 'companies', label: 'Company Master', icon: Building2, count: companies.length },
          { id: 'salts', label: 'Salt Master', icon: FlaskConical, count: salts.length },
          { id: 'categories', label: 'Category Master', icon: Tag, count: categories.length },
          { id: 'hsn', label: 'HSN / SAC Master', icon: ReceiptText, count: hsnList.length },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs md:text-sm font-bold whitespace-nowrap transition-all ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : ''}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/30 text-emerald-200 font-extrabold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{tab.count}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: ITEM MASTER (SKUs) */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Marg ERP KPI Banners */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
            <div onClick={() => setCategoryFilter('All')} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer transition-all">
              <span className="text-xs text-slate-500 font-bold block">TOTAL SKUS</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{totalSkus}</span>
            </div>
            <div onClick={() => setCategoryFilter('Low Stock')} className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 cursor-pointer transition-all">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold block">LOW STOCK</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-300 mt-1 block">{lowStockCount}</span>
            </div>
            <div onClick={() => setCategoryFilter('Near Expiry')} className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/50 cursor-pointer transition-all">
              <span className="text-xs text-rose-700 dark:text-rose-400 font-bold block">NEAR EXPIRY (&le;90d)</span>
              <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-300 mt-1 block">{nearExpiryCount}</span>
            </div>
            <div onClick={() => setCategoryFilter('Negative Stock')} className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/50 cursor-pointer transition-all">
              <span className="text-xs text-purple-700 dark:text-purple-400 font-bold block">NEGATIVE STOCK</span>
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-300 mt-1 block">{negativeStockCount}</span>
            </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block">OUT OF STOCK</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 mt-1 block">{outOfStockCount}</span>
            </div>
          </div>

          {/* Search Bar & View Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search item, packing, batch, company..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold outline-none cursor-pointer">
                <option value="All">Filter: All Stock</option>
                <option value="Low Stock">Filter: Low Stock</option>
                <option value="Near Expiry">Filter: Near Expiry</option>
                <option value="Negative Stock">Filter: Negative Stock</option>
                {categoriesList.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow' : 'text-slate-500'}`} title="Marg ERP Table View"><List className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow' : 'text-slate-500'}`} title="Grid View"><LayoutGrid className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* TABLE VIEW (Default Marg ERP Screen) */}
          {viewMode === 'table' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <th className="p-3.5 pl-5">PRODUCT NAME</th>
                      <th className="p-3.5">PACKING</th>
                      <th className="p-3.5">BATCH</th>
                      <th className="p-3.5">COMPANY</th>
                      <th className="p-3.5 text-right">STOCK</th>
                      <th className="p-3.5 text-right">M.R.P.</th>
                      <th className="p-3.5 text-right">RATE-A</th>
                      <th className="p-3.5">EXPIRY</th>
                      <th className="p-3.5 text-center">STATUS</th>
                      <th className="p-3.5 pr-5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                    {filteredMedicines.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-12 text-center text-slate-400 font-mono">No products found matching your search. Click "NEW PRODUCT MASTER" to add.</td>
                      </tr>
                    ) : filteredMedicines.map((med: any) => (
                      <tr key={med.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors group">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">{med.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{med.genericName || med.Category?.name || 'NORMAL SKU'}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-600 dark:text-slate-300">{med.packing || '1X10'}</td>
                        <td className="p-3.5 font-mono font-extrabold text-blue-600 dark:text-blue-400 uppercase">{med.batchNo}</td>
                        <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400 truncate max-w-[160px]">{med.supplier}</td>
                        <td className="p-3.5 text-right font-mono">
                          <span className={`px-2.5 py-1 rounded-lg font-extrabold border ${getStockColor(med.stock, med.minStock)}`}>
                            {med.stock} {med.unit_1st || 'TAB'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-500">{formatCurrency(med.mrp)}</td>
                        <td className="p-3.5 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(med.rate_a || med.sellingPrice)}</td>
                        <td className="p-3.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span>{formatDate(med.expiryDate)}</span>
                            {getExpiryBadge(med.expiryDate)}
                          </div>
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${med.status === 'DISCONTINUE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                            {med.status || 'CONTINUE'}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right space-x-2">
                          <button onClick={() => { setSelectedMedicine(med); setIsFormOpen(true); }} className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 rounded-lg transition-all inline-block" title="Modify Master"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedMedicine(med); setIsDeleteOpen(true); }} className="p-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg transition-all inline-block" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedicines.map((med: any) => (
                <div key={med.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between font-sans">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono text-xs font-bold uppercase">{med.packing || '1X10'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getStockColor(med.stock, med.minStock)}`}>Qty: {med.stock}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">{med.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">{med.supplier}</p>
                    
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Batch:</span><span className="font-bold text-blue-500 uppercase">{med.batchNo}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Expiry:</span><span className="font-bold">{formatDate(med.expiryDate)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">M.R.P:</span><span className="line-through text-slate-400">{formatCurrency(med.mrp)}</span></div>
                      <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5"><span className="text-slate-500 font-bold">Rate-A:</span><span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(med.rate_a || med.sellingPrice)}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => { setSelectedMedicine(med); setIsFormOpen(true); }} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"><Edit className="w-3.5 h-3.5" /> MODIFY</button>
                    <button onClick={() => { setSelectedMedicine(med); setIsDeleteOpen(true); }} className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPANY MASTER */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-mono text-slate-900 dark:text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-600" /> PHARMA COMPANY & MANUFACTURER MASTER</h2>
              <p className="text-xs text-slate-400 mt-0.5">Configure company preferences, dump days, and margin rules.</p>
            </div>
            <button onClick={() => { setMasterForm({ name: '', order_form_pref: 1, invoice_printing_pref: 1, dump_days: 60, expiry_receive_upto: 90, minimum_margin: 0 }); setMasterModal('companies'); }} className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> ADD COMPANY
            </button>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3 pl-4">COMPANY NAME</th>
                  <th className="p-3 text-center">ORDER FORM</th>
                  <th className="p-3 text-center">INV PRINTING</th>
                  <th className="p-3 text-right">DUMP DAYS</th>
                  <th className="p-3 text-right">EXP REC UPTO</th>
                  <th className="p-3 text-right">MIN MARGIN %</th>
                  <th className="p-3 pr-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {companies.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-4 font-bold text-sm text-slate-900 dark:text-white">{comp.name}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] ${comp.order_form_pref ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold' : 'bg-gray-200 text-gray-700'}`}>{comp.order_form_pref ? 'YES' : 'NO'}</span></td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] ${comp.invoice_printing_pref ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold' : 'bg-gray-200 text-gray-700'}`}>{comp.invoice_printing_pref ? 'YES' : 'NO'}</span></td>
                    <td className="p-3 text-right font-bold">{comp.dump_days || 60} Days</td>
                    <td className="p-3 text-right font-bold">{comp.expiry_receive_upto || 90} Days</td>
                    <td className="p-3 text-right font-extrabold text-emerald-600">{comp.minimum_margin || 0}%</td>
                    <td className="p-3 pr-4 text-right">
                      <button onClick={() => deleteCompanyMut.mutateAsync(comp.id)} className="text-rose-500 hover:text-rose-700 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SALT MASTER */}
      {activeTab === 'salts' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-mono text-slate-900 dark:text-white flex items-center gap-2"><FlaskConical className="w-5 h-5 text-emerald-600" /> DRUG SALT COMPOSITION MASTER</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage generic chemical formulations and salt compositions.</p>
            </div>
            <button onClick={() => { setMasterForm({ name: '' }); setMasterModal('salts'); }} className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> ADD SALT COMPOSITION
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {salts.map(salt => (
              <div key={salt.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase">{salt.name}</span>
                <button onClick={() => deleteSaltMut.mutateAsync(salt.id)} className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY MASTER */}
      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-mono text-slate-900 dark:text-white flex items-center gap-2"><Tag className="w-5 h-5 text-emerald-600" /> PRODUCT CATEGORY MASTER</h2>
              <p className="text-xs text-slate-400 mt-0.5">Organize medicines and set minimum gross profit margins per category.</p>
            </div>
            <button onClick={() => { setMasterForm({ name: '', description: '', minimum_margin: 0 }); setMasterModal('categories'); }} className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> ADD CATEGORY
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {categories.map((cat: any) => (
              <div key={cat.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase">{cat.name}</h3>
                  <button onClick={() => deleteCategoryMut.mutateAsync(cat.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-sans text-sm line-clamp-2">{cat.description || 'Standard Marg ERP Stock Category'}</p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-slate-400">Min Profit Margin:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{cat.minimum_margin || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: HSN / SAC MASTER */}
      {activeTab === 'hsn' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-mono text-slate-900 dark:text-white flex items-center gap-2"><ReceiptText className="w-5 h-5 text-emerald-600" /> HSN / SAC TAX DETAIL MASTER</h2>
              <p className="text-xs text-slate-400 mt-0.5">GST tax classifications and central/state tax breakup.</p>
            </div>
            <button onClick={() => { setMasterForm({ hsn_code: '', short_name: '', sgst: 9, cgst: 9, igst: 18, type: 'Goods', uqc: 'NUM', cess: 0 }); setMasterModal('hsn'); }} className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> ADD HSN / SAC DETAIL
            </button>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3 pl-4">HSN / SAC CODE</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3 text-center">UQC</th>
                  <th className="p-3 text-right">SGST %</th>
                  <th className="p-3 text-right">CGST %</th>
                  <th className="p-3 text-right text-blue-500">IGST %</th>
                  <th className="p-3 pr-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {hsnList.map(hsn => (
                  <tr key={hsn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-4 font-extrabold text-sm text-slate-900 dark:text-white">{hsn.hsn_code}</td>
                    <td className="p-3 font-semibold">{hsn.type}</td>
                    <td className="p-3 text-center font-bold uppercase">{hsn.uqc || 'NUM'}</td>
                    <td className="p-3 text-right font-bold">{hsn.sgst}%</td>
                    <td className="p-3 text-right font-bold">{hsn.cgst}%</td>
                    <td className="p-3 text-right font-extrabold text-blue-600 dark:text-blue-400 text-sm">{hsn.igst}%</td>
                    <td className="p-3 pr-4 text-right">
                      <button onClick={() => deleteHsnMut.mutateAsync(hsn.id)} className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Medicine Form Modal (Matching Screenshot 1) */}
      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setSelectedMedicine(null); }} title="" className="max-w-6xl">
        <MedicineForm initialData={selectedMedicine || {}} onSubmit={handleCreateOrUpdate} isLoading={createMutation.isPending || updateMutation.isPending} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Product Master" message={`Are you sure you want to delete ${selectedMedicine?.name}? This action cannot be undone.`} isLoading={deleteMutation.isPending} />

      {/* Master Add Dialogs */}
      <AnimatePresence>
        {masterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden">
              <form onSubmit={handleSaveMaster}>
                <div className="bg-emerald-800 text-white px-5 py-3 flex justify-between items-center font-bold tracking-wider text-sm uppercase">
                  <span>ADD TO {masterModal} MASTER</span>
                  <button type="button" onClick={() => setMasterModal(null)} className="hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-6 space-y-4 text-xs bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {masterModal === 'companies' && (
                    <>
                      <div><label className="block font-bold mb-1">Company Name</label><input required autoFocus value={masterForm.name || ''} onChange={e => setMasterForm({ ...masterForm, name: e.target.value })} placeholder="e.g. SUN PHARMA" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl uppercase font-bold text-sm" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block font-bold mb-1">Dump Days</label><input type="number" value={masterForm.dump_days || 60} onChange={e => setMasterForm({ ...masterForm, dump_days: Number(e.target.value) })} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl" /></div>
                        <div><label className="block font-bold mb-1">Min Margin %</label><input type="number" step="0.1" value={masterForm.minimum_margin || 0} onChange={e => setMasterForm({ ...masterForm, minimum_margin: Number(e.target.value) })} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl" /></div>
                      </div>
                    </>
                  )}

                  {masterModal === 'salts' && (
                    <div><label className="block font-bold mb-1">Salt Composition Name</label><input required autoFocus value={masterForm.name || ''} onChange={e => setMasterForm({ name: e.target.value })} placeholder="e.g. AMOXICILLIN 500MG" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl uppercase font-bold text-sm" /></div>
                  )}

                  {masterModal === 'categories' && (
                    <>
                      <div><label className="block font-bold mb-1">Category Name</label><input required autoFocus value={masterForm.name || ''} onChange={e => setMasterForm({ ...masterForm, name: e.target.value })} placeholder="e.g. DIABETIC CARE" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl uppercase font-bold text-sm" /></div>
                      <div><label className="block font-bold mb-1">Min Profit Margin %</label><input type="number" step="0.1" value={masterForm.minimum_margin || 0} onChange={e => setMasterForm({ ...masterForm, minimum_margin: Number(e.target.value) })} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl" /></div>
                    </>
                  )}

                  {masterModal === 'hsn' && (
                    <>
                      <div><label className="block font-bold mb-1">HSN Code</label><input required autoFocus value={masterForm.hsn_code || ''} onChange={e => setMasterForm({ ...masterForm, hsn_code: e.target.value })} placeholder="30049099" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-sm" /></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div><label className="block font-bold mb-1">SGST %</label><input type="number" value={masterForm.sgst ?? 6} onChange={e => setMasterForm({ ...masterForm, sgst: Number(e.target.value) })} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 rounded" /></div>
                        <div><label className="block font-bold mb-1">CGST %</label><input type="number" value={masterForm.cgst ?? 6} onChange={e => setMasterForm({ ...masterForm, cgst: Number(e.target.value) })} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 rounded" /></div>
                        <div><label className="block font-bold mb-1 text-blue-600">IGST %</label><input type="number" value={masterForm.igst ?? 12} onChange={e => setMasterForm({ ...masterForm, igst: Number(e.target.value) })} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 rounded text-blue-600 font-bold" /></div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={() => setMasterModal(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold">CANCEL</button>
                    <button type="submit" disabled={createCompanyMut.isPending || createSaltMut.isPending || createCategoryMut.isPending || createHsnMut.isPending} className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow">SAVE</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
