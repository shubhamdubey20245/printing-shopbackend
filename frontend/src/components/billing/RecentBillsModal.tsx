import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, Eye, Printer, ArrowRightLeft, CopyPlus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/cn';

interface RecentBillsModalProps {
  sales: any[];
  onClose: () => void;
  onView: (invoice: any) => void;
  onReturn: (invoice: any) => void;
  onDuplicate: (invoice: any) => void;
}

export const RecentBillsModal: React.FC<RecentBillsModalProps> = ({ sales, onClose, onView, onReturn, onDuplicate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter((s: any) => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.customer_phone || '').includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FileText className="w-5 h-5" /> Recent Invoices
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b bg-white dark:bg-[#111118]" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Invoice No, Customer Name, or Phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No invoices found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3 rounded-tl-xl rounded-bl-xl">Inv No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right rounded-tr-xl rounded-br-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredSales.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-3 font-bold text-gray-900 dark:text-gray-100">
                        INV-{inv.id.substring(0,6).toUpperCase()}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{inv.customer_name || 'Walk-in'}</div>
                        {inv.customer_phone && <div className="text-[10px] text-gray-500">{inv.customer_phone}</div>}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        {formatDate(inv.created_at)}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(inv.total_amount)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                          Paid
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => onView({ ...inv, originalId: inv.id, customer: inv.customer_name })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-primary-500 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDuplicate({ ...inv, originalId: inv.id, customer: inv.customer_name })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-amber-500 transition-colors" title="Duplicate Bill">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button onClick={() => window.open(`/print/${inv.id}`, '_blank')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-500 transition-colors" title="Print">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button onClick={() => onReturn({ ...inv, originalId: inv.id, customer: inv.customer_name })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-rose-500 transition-colors" title="Return">
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
