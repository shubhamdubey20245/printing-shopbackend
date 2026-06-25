import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Layers, Building2, FlaskConical, Tag, ReceiptText, Sparkles, Check } from 'lucide-react'
import type { Medicine } from '@/types'
import { useCompanies, useCreateCompany, useSalts, useCreateSalt, useHsnSac, useCreateHsnSac } from '@/hooks/useInventoryMasters'
import { useCategories, useCreateCategory } from '@/hooks/useCategories'
import { useToast } from '@/hooks/useToast'

interface MedicineFormProps {
  initialData?: Partial<Medicine>
  onSubmit: (data: Partial<Medicine>) => void
  isLoading?: boolean
}

export default function MedicineForm({ initialData, onSubmit, isLoading }: MedicineFormProps) {
  const { addToast } = useToast()

  // Master queries
  const { data: companies = [] } = useCompanies()
  const { data: salts = [] } = useSalts()
  const { data: hsnList = [] } = useHsnSac()
  const { data: categoriesResponse } = useCategories()
  const categories: any[] = categoriesResponse?.data || categoriesResponse || []

  // Master mutations
  const createCompanyMut = useCreateCompany()
  const createSaltMut = useCreateSalt()
  const createHsnMut = useCreateHsnSac()
  const createCategoryMut = useCreateCategory()

  // Quick modals state
  const [activeQuickModal, setActiveQuickModal] = useState<'company' | 'salt' | 'category' | 'hsn' | null>(null)

  // Quick modal form data
  const [quickCompany, setQuickCompany] = useState({ name: '', order_form_pref: 1, invoice_printing_pref: 1, dump_days: 60, expiry_receive_upto: 90, minimum_margin: 0, sales_tax: 0, sales_tax_cess: 0, purchase_tax: 0, purchase_tax_cess: 0 })
  const [quickSalt, setQuickSalt] = useState({ name: '' })
  const [quickCategory, setQuickCategory] = useState({ name: '', description: '', minimum_margin: 0 })
  const [quickHsn, setQuickHsn] = useState({ hsn_code: '', short_name: '', sgst: 9, cgst: 9, igst: 18, type: 'Goods', uqc: 'NUM', cess: 0 })

  const defaultFormData: Partial<Medicine> = {
    status: 'CONTINUE',
    type: 'NORMAL',
    hide: 'NO',
    name: '',
    packing: '1X10',
    unit_1st: 'TAB.',
    unit_2nd: 'STRP',
    decimal_allowed: 'No',
    color_type: 'NORMAL',
    item_type: '1 NORMAL',
    company_id: '',
    salt_id: '',
    category_id: '',
    hsn_sac_id: '',
    batchNo: '',
    expiryDate: '',
    rack: '',
    barcode: '',
    stock: 0,
    minStock: 10,
    local_tax: 'Taxable',
    central_tax: 'Taxable',
    mrp: 0,
    purchasePrice: 0,
    rate_a: 0,
    rate_b: 0,
    rate_c: 0,
    cost: 0,
    conv_strip: 10,
    conv_case: 50,
    csr: 0,
    sgst: 9,
    cgst: 9,
    igst: 18,
    allow_negative: 'No',
    more_options: 'No',
    gstRate: 18
  }

  const [formData, setFormData] = useState<Partial<Medicine>>(defaultFormData)

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        batchNo: initialData.batchNo || (initialData as any).batch_number || '',
        stock: initialData.stock ?? (initialData as any).stock_quantity ?? 0,
        minStock: initialData.minStock ?? (initialData as any).minimum_stock ?? 10,
        purchasePrice: initialData.purchasePrice ?? (initialData as any).purchase_price ?? 0,
        sellingPrice: initialData.sellingPrice ?? (initialData as any).selling_price ?? 0,
        rate_a: initialData.rate_a ?? initialData.sellingPrice ?? (initialData as any).selling_price ?? 0,
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : (initialData as any).expiry_date ? new Date((initialData as any).expiry_date).toISOString().split('T')[0] : ''
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const numValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value

    setFormData(prev => {
      const next = { ...prev, [name]: numValue }

      // Auto update Rate-A and sellingPrice when MRP changes if Rate-A is 0
      if (name === 'mrp' && (!prev.rate_a || prev.rate_a === 0)) {
        next.rate_a = Number(numValue)
        next.sellingPrice = Number(numValue)
      }
      if (name === 'rate_a') {
        next.sellingPrice = Number(numValue)
      }

      // Auto sync HSN GST rates
      if (name === 'hsn_sac_id') {
        const selectedHsn = hsnList.find(h => h.id === value)
        if (selectedHsn) {
          next.sgst = Number(selectedHsn.sgst)
          next.cgst = Number(selectedHsn.cgst)
          next.igst = Number(selectedHsn.igst)
          next.gstRate = Number(selectedHsn.igst)
        }
      }

      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Product Name is required' })
      return
    }
    if (!formData.batchNo) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Batch Number is required' })
      return
    }
    if (!formData.expiryDate) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Expiry Date is required' })
      return
    }

    // Ensure category_id is set if category name exists or vice versa
    const payload = {
      ...formData,
      sellingPrice: formData.rate_a || formData.sellingPrice || formData.mrp || 0
    }
    onSubmit(payload)
  }

  // Quick Master Handlers
  const handleSaveQuickCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickCompany.name) return
    try {
      const created = await createCompanyMut.mutateAsync(quickCompany)
      setFormData(prev => ({ ...prev, company_id: created.id }))
      addToast({ type: 'success', title: 'Company Added', message: `${created.name} created and selected!` })
      setActiveQuickModal(null)
      setQuickCompany({ name: '', order_form_pref: 1, invoice_printing_pref: 1, dump_days: 60, expiry_receive_upto: 90, minimum_margin: 0, sales_tax: 0, sales_tax_cess: 0, purchase_tax: 0, purchase_tax_cess: 0 })
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create company' })
    }
  }

  const handleSaveQuickSalt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickSalt.name) return
    try {
      const created = await createSaltMut.mutateAsync(quickSalt)
      setFormData(prev => ({ ...prev, salt_id: created.id }))
      addToast({ type: 'success', title: 'Salt Added', message: `${created.name} created and selected!` })
      setActiveQuickModal(null)
      setQuickSalt({ name: '' })
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create salt' })
    }
  }

  const handleSaveQuickCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickCategory.name) return
    try {
      const created: any = await createCategoryMut.mutateAsync(quickCategory)
      const catObj = created.data || created
      setFormData(prev => ({ ...prev, category_id: catObj.id, category: catObj.name }))
      addToast({ type: 'success', title: 'Category Added', message: `${catObj.name} created and selected!` })
      setActiveQuickModal(null)
      setQuickCategory({ name: '', description: '', minimum_margin: 0 })
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create category' })
    }
  }

  const handleSaveQuickHsn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickHsn.hsn_code) return
    try {
      const created = await createHsnMut.mutateAsync(quickHsn)
      setFormData(prev => ({
        ...prev,
        hsn_sac_id: created.id,
        sgst: Number(created.sgst),
        cgst: Number(created.cgst),
        igst: Number(created.igst),
        gstRate: Number(created.igst)
      }))
      addToast({ type: 'success', title: 'HSN Added', message: `${created.hsn_code} created and selected!` })
      setActiveQuickModal(null)
      setQuickHsn({ hsn_code: '', short_name: '', sgst: 9, cgst: 9, igst: 18, type: 'Goods', uqc: 'NUM', cess: 0 })
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create HSN/SAC' })
    }
  }

  return (
    <div className="relative font-sans text-gray-800 dark:text-gray-100 max-h-[85vh] overflow-y-auto pr-1">
      {/* Marg ERP Styled Header Banner */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 rounded-t-2xl shadow-lg flex flex-wrap items-center justify-between gap-4 border-b border-emerald-600/40">
        <div className="flex items-center gap-2 font-mono tracking-wider font-bold text-base md:text-lg">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>{formData.id ? 'MODIFY PRODUCT MASTER' : 'NEW PRODUCT MASTER'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300 font-semibold">STATUS:</span>
            <select name="status" value={formData.status} onChange={handleChange} className="bg-emerald-950/80 text-white font-bold px-2 py-0.5 rounded border border-emerald-600/50 outline-none text-xs cursor-pointer">
              <option value="CONTINUE">CONTINUE</option>
              <option value="DISCONTINUE">DISCONTINUE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300 font-semibold">TYPE:</span>
            <select name="type" value={formData.type} onChange={handleChange} className="bg-emerald-950/80 text-white font-bold px-2 py-0.5 rounded border border-emerald-600/50 outline-none text-xs cursor-pointer">
              <option value="NORMAL">NORMAL</option>
              <option value="SPECIAL">SPECIAL</option>
              <option value="NARCOTIC">NARCOTIC</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300 font-semibold">HIDE:</span>
            <select name="hide" value={formData.hide} onChange={handleChange} className="bg-emerald-950/80 text-white font-bold px-2 py-0.5 rounded border border-emerald-600/50 outline-none text-xs cursor-pointer">
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-5 md:p-6 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
        {/* Section 1: Core Item Definition */}
        <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4.5 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm space-y-4 font-mono text-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">PRODUCT NAME *</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. CROCIN ADVANCE 500MG" className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-emerald-500/40 dark:border-emerald-600/40 rounded-xl font-bold text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-inner transition-all" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">PACKING</label>
              <input name="packing" value={formData.packing || ''} onChange={handleChange} placeholder="1X10 / 100ML" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">ITEM TYPE</label>
              <select name="item_type" value={formData.item_type} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-xs focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="1 NORMAL">1 NORMAL</option>
                <option value="2 NARCOTIC">2 NARCOTIC</option>
                <option value="3 SCHEDULE H1">3 SCHEDULE H1</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700/60">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">UNIT 1st (Small)</label>
              <input name="unit_1st" value={formData.unit_1st || ''} onChange={handleChange} placeholder="TAB." className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">UNIT 2nd (Pack)</label>
              <input name="unit_2nd" value={formData.unit_2nd || ''} onChange={handleChange} placeholder="STRP" className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">DECIMAL</label>
              <select name="decimal_allowed" value={formData.decimal_allowed} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold cursor-pointer">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">COLOR TYPE</label>
              <select name="color_type" value={formData.color_type} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold cursor-pointer">
                <option value="NORMAL">NORMAL</option>
                <option value="RED">RED (Rx)</option>
                <option value="GREEN">GREEN (OTC)</option>
                <option value="SCHEDULE H">SCHEDULE H</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Master Selectors with Quick Add '+' Modals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* COMPANY */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> COMPANY MASTER</span>
              <button type="button" onClick={() => setActiveQuickModal('company')} className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors">
                <Plus className="w-3 h-3" /> ADD COMPANY
              </button>
            </label>
            <select name="company_id" value={formData.company_id || ''} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
              <option value="">-- Select Company / Manufacturer --</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* SALT */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> SALT COMPOSITION</span>
              <button type="button" onClick={() => setActiveQuickModal('salt')} className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors">
                <Plus className="w-3 h-3" /> ADD SALT
              </button>
            </label>
            <select name="salt_id" value={formData.salt_id || ''} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
              <option value="">-- Select Drug Salt Composition --</option>
              {salts.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> CATEGORY *</span>
              <button type="button" onClick={() => setActiveQuickModal('category')} className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors">
                <Plus className="w-3 h-3" /> ADD CATEGORY
              </button>
            </label>
            <select required name="category_id" value={formData.category_id || ''} onChange={e => {
              const cat = categories.find((c: any) => c.id === e.target.value)
              setFormData(p => ({ ...p, category_id: e.target.value, category: cat?.name || '' }))
            }} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
              <option value="">-- Select Product Category --</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* HSN / SAC */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5"><ReceiptText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> HSN / SAC DETAIL</span>
              <button type="button" onClick={() => setActiveQuickModal('hsn')} className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors">
                <Plus className="w-3 h-3" /> ADD HSN
              </button>
            </label>
            <select name="hsn_sac_id" value={formData.hsn_sac_id || ''} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
              <option value="">-- Select HSN Code --</option>
              {hsnList.map(h => (
                <option key={h.id} value={h.id}>{h.hsn_code} (GST {h.igst}%)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: Inventory Batch, Expiry & Conversions */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-sm">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">BATCH NO *</label>
            <input required name="batchNo" value={formData.batchNo || ''} onChange={handleChange} placeholder="B1234" className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold uppercase" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">EXPIRY *</label>
            <input required type="date" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">STOCK QTY</label>
            <input type="number" name="stock" value={formData.stock ?? 0} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-emerald-500/50 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">MIN STOCK</label>
            <input type="number" name="minStock" value={formData.minStock ?? 10} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1" title="Tablets in 1 Strip">CONV. STRI</label>
            <input type="number" step="1" name="conv_strip" value={formData.conv_strip ?? 10} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1" title="Strips in 1 Case">CONV. CASE</label>
            <input type="number" step="1" name="conv_case" value={formData.conv_case ?? 50} onChange={handleChange} className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold" />
          </div>
        </div>

        {/* Section 4: Taxation & Rates Grid (Bottom Section in Marg ERP) */}
        <div className="bg-slate-100 dark:bg-slate-900/80 p-4.5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-inner space-y-4 font-mono text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">LOCAL BILLING</label>
              <select name="local_tax" value={formData.local_tax} onChange={handleChange} className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold">
                <option value="Taxable">Taxable</option>
                <option value="Exempt">Exempt</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">CENTRAL BILLING</label>
              <select name="central_tax" value={formData.central_tax} onChange={handleChange} className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold">
                <option value="Taxable">Taxable</option>
                <option value="Exempt">Exempt</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">RACK / SHELF</label>
              <input name="rack" value={formData.rack || ''} onChange={handleChange} placeholder="R-12" className="w-full px-2.5 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold uppercase" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">BARCODE</label>
              <input name="barcode" value={formData.barcode || ''} onChange={handleChange} placeholder="890123..." className="w-full px-2.5 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-center">
            <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-300/60 dark:border-amber-800/50">
              <label className="block text-[11px] font-extrabold text-amber-800 dark:text-amber-400 mb-0.5">M.R.P. (Max)</label>
              <input required type="number" step="0.01" name="mrp" value={formData.mrp ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-amber-400 rounded text-sm font-extrabold text-gray-900 dark:text-white text-right" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">P.RATE (Pur)</label>
              <input required type="number" step="0.01" name="purchasePrice" value={formData.purchasePrice ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold text-right" />
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-300/60 dark:border-emerald-800/50">
              <label className="block text-[11px] font-extrabold text-emerald-800 dark:text-emerald-400 mb-0.5">Rate-A (Retail)</label>
              <input required type="number" step="0.01" name="rate_a" value={formData.rate_a ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-500 rounded text-sm font-extrabold text-emerald-700 dark:text-emerald-300 text-right" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Rate-B (Wholesale)</label>
              <input type="number" step="0.01" name="rate_b" value={formData.rate_b ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold text-right" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Rate-C (Special)</label>
              <input type="number" step="0.01" name="rate_c" value={formData.rate_c ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold text-right" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">COST / UNIT</label>
              <input type="number" step="0.0001" name="cost" value={formData.cost ?? formData.purchasePrice ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold text-right text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block mb-1">SGST % :</span>
              <input type="number" step="0.1" name="sgst" value={formData.sgst ?? 9} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded font-bold text-right" />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1">CGST % :</span>
              <input type="number" step="0.1" name="cgst" value={formData.cgst ?? 9} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded font-bold text-right" />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1">IGST % :</span>
              <input type="number" step="0.1" name="igst" value={formData.igst ?? 18} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded font-bold text-right text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1">NEGATIVE STOCK :</span>
              <select name="allow_negative" value={formData.allow_negative} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded font-bold">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1">C.S.R. RATE :</span>
              <input type="number" step="0.01" name="csr" value={formData.csr ?? 0} onChange={handleChange} className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded font-bold text-right" />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button type="submit" disabled={isLoading} className="btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono tracking-wider font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Check className="w-5 h-5" />
                <span>SAVE PRODUCT MASTER</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Add Modals (Matching Screenshots 2, 3, 4, 5) */}
      <AnimatePresence>
        {activeQuickModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden font-mono">
              
              {/* COMPANY MODAL (Screenshot 2) */}
              {activeQuickModal === 'company' && (
                <form onSubmit={handleSaveQuickCompany}>
                  <div className="bg-emerald-800 text-white px-5 py-3 flex justify-between items-center font-bold tracking-wider text-sm">
                    <span>NEW COMPANY</span>
                    <button type="button" onClick={() => setActiveQuickModal(null)} className="hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4 text-xs bg-[#e4ebe4] dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-28 font-bold">Name</span>:
                      <input required autoFocus value={quickCompany.name} onChange={e => setQuickCompany(p => ({ ...p, name: e.target.value }))} placeholder="e.g. TRADER PHARMA" className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-400 rounded uppercase font-bold" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-28 font-bold">Preferences</span>:
                      <label className="flex items-center gap-1 font-semibold"><input type="checkbox" checked={quickCompany.order_form_pref === 1} onChange={e => setQuickCompany(p => ({ ...p, order_form_pref: e.target.checked ? 1 : 0 }))} /> Order Form</label>
                      <label className="flex items-center gap-1 font-semibold ml-4"><input type="checkbox" checked={quickCompany.invoice_printing_pref === 1} onChange={e => setQuickCompany(p => ({ ...p, invoice_printing_pref: e.target.checked ? 1 : 0 }))} /> Invoice Printing</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-24 font-bold">Dump Days</span>:
                        <input type="number" value={quickCompany.dump_days} onChange={e => setQuickCompany(p => ({ ...p, dump_days: Number(e.target.value) }))} className="w-16 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-32 font-bold">Expiry Rec. Upto</span>:
                        <input type="number" value={quickCompany.expiry_receive_upto} onChange={e => setQuickCompany(p => ({ ...p, expiry_receive_upto: Number(e.target.value) }))} className="w-16 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-28 font-bold">Minimum Margin</span>:
                      <input type="number" step="0.01" value={quickCompany.minimum_margin} onChange={e => setQuickCompany(p => ({ ...p, minimum_margin: Number(e.target.value) }))} className="w-24 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right" /> %
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={createCompanyMut.isPending} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded shadow">SAVE COMPANY</button>
                    </div>
                  </div>
                </form>
              )}

              {/* SALT MODAL (Screenshot 3) */}
              {activeQuickModal === 'salt' && (
                <form onSubmit={handleSaveQuickSalt}>
                  <div className="bg-emerald-800 text-white px-5 py-3 flex justify-between items-center font-bold tracking-wider text-sm">
                    <span>NEW SALT COMPOSITION</span>
                    <button type="button" onClick={() => setActiveQuickModal(null)} className="hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4 text-xs bg-[#e4ebe4] dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-24 font-bold">New Salt</span>:
                      <input required autoFocus value={quickSalt.name} onChange={e => setQuickSalt({ name: e.target.value })} placeholder="e.g. PARACETAMOL 500MG" className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-400 rounded uppercase font-bold text-sm" />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={createSaltMut.isPending} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded shadow">SAVE SALT</button>
                    </div>
                  </div>
                </form>
              )}

              {/* CATEGORY MODAL (Screenshot 4) */}
              {activeQuickModal === 'category' && (
                <form onSubmit={handleSaveQuickCategory}>
                  <div className="bg-emerald-800 text-white px-5 py-3 flex justify-between items-center font-bold tracking-wider text-sm">
                    <span>NEW CATEGORY</span>
                    <button type="button" onClick={() => setActiveQuickModal(null)} className="hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4 text-xs bg-[#e4ebe4] dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-32 font-bold">Category Name</span>:
                      <input required autoFocus value={quickCategory.name} onChange={e => setQuickCategory(p => ({ ...p, name: e.target.value }))} placeholder="e.g. CARDIAC CARE" className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-400 rounded uppercase font-bold text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-32 font-bold">Minimum Margin</span>:
                      <input type="number" step="0.01" value={quickCategory.minimum_margin} onChange={e => setQuickCategory(p => ({ ...p, minimum_margin: Number(e.target.value) }))} className="w-24 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right" /> %
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={createCategoryMut.isPending} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded shadow">SAVE CATEGORY</button>
                    </div>
                  </div>
                </form>
              )}

              {/* HSN MODAL (Screenshot 5) */}
              {activeQuickModal === 'hsn' && (
                <form onSubmit={handleSaveQuickHsn}>
                  <div className="bg-emerald-800 text-white px-5 py-3 flex justify-between items-center font-bold tracking-wider text-sm">
                    <span>HSN / SAC DETAIL</span>
                    <button type="button" onClick={() => setActiveQuickModal(null)} className="hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-3 text-xs bg-[#e4ebe4] dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-24 font-bold">HSN/SAC Code</span>:
                      <input required autoFocus value={quickHsn.hsn_code} onChange={e => setQuickHsn(p => ({ ...p, hsn_code: e.target.value }))} placeholder="80000008" className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-400 rounded font-bold" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div>
                        <span className="block font-bold">SGST %</span>
                        <input type="number" step="0.1" value={quickHsn.sgst} onChange={e => setQuickHsn(p => ({ ...p, sgst: Number(e.target.value) }))} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right font-bold" />
                      </div>
                      <div>
                        <span className="block font-bold">CGST %</span>
                        <input type="number" step="0.1" value={quickHsn.cgst} onChange={e => setQuickHsn(p => ({ ...p, cgst: Number(e.target.value) }))} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right font-bold" />
                      </div>
                      <div>
                        <span className="block font-bold text-blue-600">IGST %</span>
                        <input type="number" step="0.1" value={quickHsn.igst} onChange={e => setQuickHsn(p => ({ ...p, igst: Number(e.target.value) }))} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded text-right font-bold text-blue-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="block font-bold">TYPE</span>
                        <select value={quickHsn.type} onChange={e => setQuickHsn(p => ({ ...p, type: e.target.value }))} className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded font-bold">
                          <option value="Goods">Goods</option>
                          <option value="Services">Services</option>
                        </select>
                      </div>
                      <div>
                        <span className="block font-bold">UQC (Unit)</span>
                        <input value={quickHsn.uqc} onChange={e => setQuickHsn(p => ({ ...p, uqc: e.target.value }))} placeholder="TAB / STR / BOX" className="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-400 rounded uppercase font-bold" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={createHsnMut.isPending} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded shadow">SAVE HSN/SAC</button>
                    </div>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
