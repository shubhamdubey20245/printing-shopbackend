import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, UserCheck } from 'lucide-react'
import api from '@/lib/api'

interface DoctorDetailsModalProps {
  phone: string
  onClose: () => void
  onSave: (doctorData: any) => void
}

export function DoctorDetailsModal({ phone, onClose, onSave }: DoctorDetailsModalProps) {
  const [formData, setFormData] = useState({
    mobile: phone,
    name: '',
    address: '',
    regNo: '',
    phoneNo: '',
    commissionPercent: '0.00',
    speciality: '',
    qualification: ''
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        name: formData.name || 'Unknown Doctor',
        phone: formData.mobile,
        reg_no: formData.regNo,
        address: formData.address,
        commission_percent: parseFloat(formData.commissionPercent) || 0,
        speciality: formData.speciality,
        qualification: formData.qualification
      }
      
      const res = await api.post('/doctors', payload)
      onSave({
        id: res.data.data?.id,
        name: payload.name,
        phone: payload.phone,
        regNo: payload.reg_no,
      })
    } catch (err) {
      console.error('Error saving doctor:', err)
      onSave({
        name: formData.name,
        phone: formData.mobile,
        regNo: formData.regNo,
      })
    }
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#1a1a24] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col font-sans"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-4 py-2.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 opacity-80" />
            <h2 className="font-bold text-sm tracking-wide uppercase">Doctor Detail</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Ultra Compact, No Scrolling */}
        <div className="p-4 text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-[#12121a]/30">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Mobile / Code</label>
              <input type="text" name="mobile" value={formData.mobile} readOnly className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1.5 rounded outline-none font-bold text-teal-600 cursor-not-allowed text-xs" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Dr. Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} autoFocus className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold text-xs" />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 text-xs" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Rg. No.</label>
              <input type="text" name="regNo" value={formData.regNo} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 text-xs" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Phone No.</label>
              <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 text-xs" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-rose-500 uppercase mb-0.5">Commission %</label>
              <input type="number" step="0.01" name="commissionPercent" value={formData.commissionPercent} onChange={handleChange} className="w-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-2 py-1.5 rounded outline-none focus:border-rose-500 font-bold text-rose-600 dark:text-rose-400 text-xs" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-teal-600 uppercase mb-0.5">Speciality</label>
              <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 text-xs" />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] font-bold text-teal-600 uppercase mb-0.5">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded outline-none focus:border-teal-500 text-xs" />
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-white dark:bg-[#1a1a24] border-t border-gray-200 dark:border-gray-800 p-3 px-5 flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-1.5 rounded-lg font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-teal-500/30 active:scale-95 text-xs"
          >
            {isSaving ? <span className="animate-spin text-sm">↻</span> : <Save className="w-3.5 h-3.5" />}
            Save Doctor
          </button>
        </div>
      </motion.div>
    </div>
  )
}
