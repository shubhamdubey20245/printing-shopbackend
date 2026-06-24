import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, Plus, Phone, MapPin, 
  X, Edit, Trash2, Stethoscope, Percent, Award
} from 'lucide-react'
import type { Doctor } from '@/types'
import { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from '@/hooks/useDoctors'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import DoctorForm from '@/components/doctors/DoctorForm'
import { useToast } from '@/hooks/useToast'

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const { addToast } = useToast()

  const { data: response, isLoading: loading } = useDoctors()
  const createMutation = useCreateDoctor()
  const updateMutation = useUpdateDoctor()
  const deleteMutation = useDeleteDoctor()

  const rawDoctors = response?.data || []
  const doctors = useMemo(() => rawDoctors.map((d: any) => ({
    id: d.id,
    name: d.name,
    phone: d.phone,
    reg_no: d.reg_no || '',
    commission_percent: d.commission_percent,
    address: d.address || '',
    speciality: d.speciality || '',
    qualification: d.qualification || ''
  })), [rawDoctors])

  const selectedDoctorData = selectedDoctor ? doctors.find((d: any) => d.id === selectedDoctor) : null

  const handleCreateOrUpdate = async (data: Partial<Doctor>) => {
    try {
      if (editingDoctor) {
        await updateMutation.mutateAsync({ id: editingDoctor.id, data })
        addToast({ type: 'success', title: 'Success', message: 'Doctor updated successfully' })
      } else {
        await createMutation.mutateAsync(data)
        addToast({ type: 'success', title: 'Success', message: 'Doctor added successfully' })
      }
      setIsFormOpen(false)
      setEditingDoctor(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save doctor' })
    }
  }

  const handleDelete = async () => {
    if (!editingDoctor) return
    try {
      await deleteMutation.mutateAsync(editingDoctor.id)
      addToast({ type: 'success', title: 'Success', message: 'Doctor deleted successfully' })
      setIsDeleteOpen(false)
      setSelectedDoctor(null)
      setEditingDoctor(null)
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete doctor' })
    }
  }

  const openEdit = (doctor: any) => {
    setEditingDoctor(doctor)
    setIsFormOpen(true)
  }

  const openDelete = (doctor: any) => {
    setEditingDoctor(doctor)
    setIsDeleteOpen(true)
  }

  const filteredDoctors = useMemo(() => doctors.filter((d: any) => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.phone.includes(searchQuery)
    return matchSearch
  }), [doctors, searchQuery])

  const getGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30',
      'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30',
      'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30',
      'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30'
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)] -m-2 p-2">
      <div className={`flex-1 overflow-y-auto space-y-6 pr-2 ${selectedDoctor ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-header flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-500" />
              Doctors
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Total Registered Doctors: <span className="text-teal-500 font-medium">{doctors.length}</span>
            </p>
          </div>
          <button onClick={() => { setEditingDoctor(null); setIsFormOpen(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name or phone..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-gray-900 border outline-none focus:border-teal-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-[#1a1a24]/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No doctors found</h3>
              <p className="text-gray-500 text-sm mt-1 text-center max-w-sm">
                {searchQuery ? "We couldn't find any doctors matching your search." : "You haven't added any doctors yet. Start by adding a new doctor to your network."}
              </p>
              {!searchQuery && (
                <button onClick={() => { setEditingDoctor(null); setIsFormOpen(true); }} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                  <Plus className="w-4 h-4" /> Add Your First Doctor
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredDoctors.map((doctor: any, i: number) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor.id)}
                  className={`card p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-card-hover group border-2 ${selectedDoctor === doctor.id ? 'border-teal-400 dark:border-teal-600' : 'border-transparent'}`}
                  style={selectedDoctor !== doctor.id ? { borderColor: 'var(--border)' } : {}}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-inner ${getGradient(i)}`}>
                      {doctor.name.charAt(0)}
                    </div>
                    {doctor.speciality && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-teal-200 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800">
                        {doctor.speciality}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{doctor.name}</h3>
                  <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    <Phone className="w-3 h-3" /> {doctor.phone}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1"><Percent className="w-3 h-3" /> Commission</p>
                      <p className="font-bold text-sm mt-0.5 text-teal-600 dark:text-teal-400">{doctor.commission_percent}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-semibold text-gray-400 flex justify-end gap-1"><Award className="w-3 h-3" /> Reg No.</p>
                      <p className="font-medium text-sm mt-0.5 text-gray-600 dark:text-gray-400">{doctor.reg_no || '-'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedDoctor && selectedDoctorData && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full lg:w-1/3 card h-full flex flex-col shadow-floating"
            style={{ zIndex: 10 }}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Doctor Profile</h3>
                <button onClick={() => openEdit(selectedDoctorData)} className="p-1.5 ml-2 text-gray-400 hover:text-teal-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(selectedDoctorData)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setSelectedDoctor(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mb-3 ${getGradient(doctors.findIndex((d: any) => d.id === selectedDoctor))}`}>
                  {selectedDoctorData.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedDoctorData.name}</h2>
                {selectedDoctorData.speciality && (
                  <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-teal-200 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800">
                    {selectedDoctorData.speciality}
                  </span>
                )}
              </div>

              {/* Info Details */}
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 space-y-4 border" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><Phone className="w-4 h-4" /></div>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedDoctorData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><Award className="w-4 h-4" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 font-semibold">Qualification</span>
                    <span style={{ color: 'var(--text-primary)' }}>{selectedDoctorData.qualification || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm text-gray-500"><MapPin className="w-4 h-4" /></div>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedDoctorData.address || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4 text-center bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30">
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1">Commission <Percent className="w-3 h-3" /></p>
                  <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{selectedDoctorData.commission_percent}%</p>
                </div>
                <div className="card p-4 text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1">Reg No.</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedDoctorData.reg_no || '-'}</p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingDoctor ? "Edit Doctor" : "Add Doctor"} size="md">
        <DoctorForm 
          initialData={editingDoctor || undefined} 
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${editingDoctor?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
