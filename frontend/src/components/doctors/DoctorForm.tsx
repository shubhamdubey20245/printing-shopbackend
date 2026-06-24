import { useState, useEffect } from 'react'
import type { Doctor } from '@/types'

interface DoctorFormProps {
  initialData?: Partial<Doctor>
  onSubmit: (data: Partial<Doctor>) => void
  isLoading?: boolean
}

export default function DoctorForm({ initialData, onSubmit, isLoading }: DoctorFormProps) {
  const defaultFormData: Partial<Doctor> = {
    name: '',
    phone: '',
    reg_no: '',
    commission_percent: 0,
    address: '',
    speciality: '',
    qualification: ''
  }

  const [formData, setFormData] = useState<Partial<Doctor>>(defaultFormData)

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
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Name *</label>
          <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="e.g. Dr. John Doe" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Phone *</label>
          <input required name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="10-digit number" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Registration No.</label>
          <input name="reg_no" value={formData.reg_no || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Optional" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Commission % *</label>
          <div className="relative">
            <input required type="number" step="0.01" name="commission_percent" value={formData.commission_percent ?? ''} onChange={handleChange} className="w-full pl-4 pr-8 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-bold text-teal-600 dark:text-teal-400" placeholder="0.00" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Speciality</label>
          <input name="speciality" value={formData.speciality || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="e.g. Cardiologist" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Qualification</label>
          <input name="qualification" value={formData.qualification || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="e.g. MBBS, MD" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Address</label>
          <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 dark:bg-[#12121a]/50 text-sm focus:bg-white dark:focus:bg-[#1a1a24] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Full clinic address" />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2 rounded-xl flex items-center justify-center min-w-[120px] transition-colors shadow-md">
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Doctor'}
        </button>
      </div>
    </form>
  )
}
