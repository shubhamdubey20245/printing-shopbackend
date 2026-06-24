import { motion } from 'framer-motion';
import { X, Clock, Play } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/cn';

export const HoldBillsModal = ({ 
  holdBills, 
  onLoad, 
  onClose,
  onDelete
}: { 
  holdBills: any[], 
  onLoad: (bill: any) => void, 
  onClose: () => void,
  onDelete: (id: string) => void
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-lg w-full flex flex-col border"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Hold Bills (F7)</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
          {holdBills.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No bills on hold</p>
            </div>
          ) : (
            holdBills.map((bill) => (
              <div key={bill.id} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center group hover:bg-white dark:hover:bg-gray-800 transition-colors" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>{bill.customer.name || 'Walk-in'}</h4>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(bill.timestamp)}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {bill.items.length} Items
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20">
                      {formatCurrency(bill.grandTotal)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onLoad(bill)}
                    className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-3 h-3" /> Load Bill
                  </button>
                  <button 
                    onClick={() => onDelete(bill.id)}
                    className="text-xs font-bold text-rose-500 hover:underline text-right"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
