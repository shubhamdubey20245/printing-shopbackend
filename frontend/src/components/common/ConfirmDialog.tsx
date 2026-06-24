import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, 
  confirmText = 'Confirm', cancelText = 'Cancel', 
  isDangerous = false, isLoading = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDangerous ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-sm font-medium border text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm flex items-center gap-2 ${
            isDangerous ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
