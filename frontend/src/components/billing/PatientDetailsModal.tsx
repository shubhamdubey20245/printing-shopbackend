import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, User } from 'lucide-react'
import api from '@/lib/api'

interface PatientDetailsModalProps {
  phone: string
  onClose: () => void
  onSave: (patientData: any) => void
}

export function PatientDetailsModal({ phone, onClose, onSave }: PatientDetailsModalProps) {
  const [formData, setFormData] = useState({
    mobile: phone,
    name: '',
    address: '',
    pinCode: '',
    city: '',
    state: 'Yes',
    disease: 'A General',
    remark: '',
    dtDiagnose: '',
    dtTreatment: '',
    age: '',
    weight: '',
    gender: 'Male',
    bpSystemic: '',
    bpDiastolic: '',
    pulse: '',
    sugar: '',
    soWo: '',
    dob: '',
    pinNo: '',
    idNo: '',
    phoneNo2: '',
    discountPercent: '0.00'
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        name: formData.name || 'Unknown Patient',
        phone: formData.mobile,
        email: '',
        address: formData.address,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        discount_percent: parseFloat(formData.discountPercent) || 0
      }
      
      const res = await api.post('/customers', payload)
      onSave({
        name: payload.name,
        phone: payload.phone,
        age: payload.age.toString(),
        gender: payload.gender,
        discount_percent: payload.discount_percent
      })
    } catch (err) {
      console.error('Error saving patient:', err)
      onSave({
        name: formData.name,
        phone: formData.mobile,
        age: formData.age,
        gender: formData.gender,
        discount_percent: parseFloat(formData.discountPercent) || 0
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
        className="bg-white dark:bg-[#1a1a24] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col font-sans"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-2.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 opacity-80" />
            <h2 className="font-bold text-sm tracking-wide">Patient Registration</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Ultra Compact, No Scrolling */}
        <div className="p-4 text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-[#12121a]/30">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-3 gap-y-2">
            
            {/* Row 1 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Mobile Number</label>
              <input type="text" name="mobile" value={formData.mobile} readOnly className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded outline-none font-bold text-indigo-600 cursor-not-allowed text-xs" />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Patient Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} autoFocus className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">S/o / W/o</label>
              <input type="text" name="soWo" value={formData.soWo} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>

            {/* Row 2 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1.5 py-1 rounded outline-none focus:border-indigo-500 text-xs">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Age (Yrs)</label>
              <input type="text" name="age" value={formData.age} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Alt Phone</label>
              <input type="text" name="phoneNo2" value={formData.phoneNo2} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Address Line 1</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Address Line 2</label>
              <input type="text" placeholder="Optional" className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>

            {/* Row 4 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Pin Code</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">ID No.</label>
              <input type="text" name="idNo" value={formData.idNo} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>

            {/* Row 5 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Disease Type</label>
              <select name="disease" value={formData.disease} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1.5 py-1 rounded outline-none focus:border-indigo-500 text-xs">
                <option>A General</option>
                <option>B Cardiac</option>
                <option>C Diabetic</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Dt. Diagnose</label>
              <input type="date" name="dtDiagnose" value={formData.dtDiagnose} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Dt. Treatment</label>
              <input type="date" name="dtTreatment" value={formData.dtTreatment} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Weight (kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="0.00" className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>

            {/* Row 6 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Pulse</label>
              <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} placeholder="BPM" className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">B.P. (Sys/Dia)</label>
              <div className="flex items-center gap-1">
                <input type="text" name="bpSystemic" value={formData.bpSystemic} onChange={handleChange} placeholder="120" className="flex-1 min-w-0 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1 rounded outline-none focus:border-indigo-500 text-xs text-center" />
                <span className="text-gray-400 font-bold text-xs">/</span>
                <input type="text" name="bpDiastolic" value={formData.bpDiastolic} onChange={handleChange} placeholder="80" className="flex-1 min-w-0 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1 rounded outline-none focus:border-indigo-500 text-xs text-center" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5">Sugar (F/PP)</label>
              <div className="flex items-center gap-1">
                <input type="text" name="sugar" value={formData.sugar} onChange={handleChange} placeholder="F" className="flex-1 min-w-0 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1 rounded outline-none focus:border-indigo-500 text-xs text-center" />
                <span className="text-gray-400 font-bold text-xs">/</span>
                <input type="text" placeholder="PP" className="flex-1 min-w-0 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1 rounded outline-none focus:border-indigo-500 text-xs text-center" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-rose-500 uppercase mb-0.5">Discount %</label>
              <input type="number" step="0.01" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="w-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-2 py-1 rounded outline-none focus:border-rose-500 font-bold text-rose-600 dark:text-rose-400 text-right text-xs" />
            </div>

            {/* Row 7 */}
            <div className="flex flex-col md:col-span-4 mt-0.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Remark / Notes</label>
              <input type="text" name="remark" value={formData.remark} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1 rounded outline-none focus:border-indigo-500 text-xs" />
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
            className="px-6 py-1.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30 active:scale-95 text-xs"
          >
            {isSaving ? <span className="animate-spin text-sm">↻</span> : <Save className="w-3.5 h-3.5" />}
            Save Profile
          </button>
        </div>
      </motion.div>
    </div>
  )
}
