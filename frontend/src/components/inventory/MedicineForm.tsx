import { useState, useEffect } from 'react'
import type { Medicine } from '@/types'

interface MedicineFormProps {
  initialData?: Partial<Medicine>
  onSubmit: (data: Partial<Medicine>) => void
  isLoading?: boolean
}

export default function MedicineForm({ initialData, onSubmit, isLoading }: MedicineFormProps) {
  const defaultFormData: Partial<Medicine> = {
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    batchNo: '',
    expiryDate: '',
    mrp: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    unit: '',
    hsn: '',
    gstRate: 0,
    rack: '',
    barcode: ''
  }

  const [formData, setFormData] = useState<Partial<Medicine>>(defaultFormData)

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
          <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Generic Name</label>
          <input name="genericName" value={formData.genericName || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Manufacturer</label>
          <input name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
          <input required name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Batch No *</label>
          <input required name="batchNo" value={formData.batchNo || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date *</label>
          <input required type="date" name="expiryDate" value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">MRP</label>
          <input type="number" step="0.01" name="mrp" value={formData.mrp ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price *</label>
          <input required type="number" step="0.01" name="sellingPrice" value={formData.sellingPrice ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
          <input type="number" name="stock" value={formData.stock ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min Stock</label>
          <input type="number" name="minStock" value={formData.minStock ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Unit (e.g. Strip, Bottle)</label>
          <input name="unit" value={formData.unit || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rack / Location</label>
          <input name="rack" value={formData.rack || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={isLoading} className="btn-primary px-6 py-2 rounded-xl flex items-center justify-center min-w-[120px]">
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Medicine'}
        </button>
      </div>
    </form>
  )
}
