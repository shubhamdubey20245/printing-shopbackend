import { useState, useEffect } from 'react'
import type { Customer } from '@/types'

interface CustomerFormProps {
  initialData?: Partial<Customer>
  onSubmit: (data: Partial<Customer>) => void
  isLoading?: boolean
}

export default function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
  const defaultFormData: Partial<Customer> = {
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'regular'
  }

  const [formData, setFormData] = useState<Partial<Customer>>(defaultFormData)

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
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
          <input required name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
          <select required name="type" value={formData.type || 'regular'} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="wholesale">Wholesale</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={isLoading} className="btn-primary px-6 py-2 rounded-xl flex items-center justify-center min-w-[120px]">
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Customer'}
        </button>
      </div>
    </form>
  )
}
