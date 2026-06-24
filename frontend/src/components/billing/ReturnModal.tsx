import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/cn';
import { useProcessReturn } from '@/hooks/useBilling';

export const ReturnModal = ({ invoice, onClose }: { invoice: any, onClose: () => void }) => {
  const [returnItems, setReturnItems] = useState<Record<string, number>>({});
  const returnMutation = useProcessReturn();

  const handleQtyChange = (itemId: string, maxQty: number, val: number) => {
    if (val < 0) val = 0;
    if (val > maxQty) val = maxQty;
    
    setReturnItems(prev => ({
      ...prev,
      [itemId]: val
    }));
  };

  const calculateRefund = () => {
    let total = 0;
    invoice.items.forEach((item: any) => {
      const returnQty = returnItems[item.id] || 0;
      if (returnQty > 0) {
        const unitPrice = Number(item.price);
        const unitGst = unitPrice * (Number(item.gst) / 100);
        total += (unitPrice + unitGst) * returnQty;
      }
    });
    return total;
  };

  const handleReturn = async () => {
    const payload = Object.entries(returnItems)
      .filter(([_, qty]) => qty > 0)
      .map(([saleItemId, quantityToReturn]) => ({ saleItemId, quantityToReturn }));

    if (payload.length === 0) {
      alert("Please specify quantity to return");
      return;
    }

    try {
      await returnMutation.mutateAsync({ id: invoice.originalId, returnItems: payload });
      alert("Return processed successfully!");
      onClose();
    } catch (err: any) {
      alert("Failed to process return: " + err.message);
    }
  };

  const totalRefund = calculateRefund();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="p-4 border-b flex justify-between items-center bg-rose-50 dark:bg-rose-900/10" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-rose-600 dark:text-rose-400">Process Return</h3>
              <p className="text-xs font-medium text-rose-500/80">Invoice {invoice.id} • {invoice.customer}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 flex gap-2 text-amber-800 dark:text-amber-200 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Specify the quantity of each item the customer is returning. The inventory will be automatically restocked.
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-3 font-semibold rounded-l-xl">Product</th>
                <th className="p-3 font-semibold text-center">Purchased</th>
                <th className="p-3 font-semibold text-center">Return Qty</th>
                <th className="p-3 font-semibold text-right rounded-r-xl">Refund Val</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {invoice.items.map((item: any) => {
                const returnQty = returnItems[item.id] || 0;
                const unitPrice = Number(item.price);
                const unitGst = unitPrice * (Number(item.gst) / 100);
                const refundVal = (unitPrice + unitGst) * returnQty;

                return (
                  <tr key={item.id} className="group">
                    <td className="p-3">
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.name || item.medicine?.name}</p>
                      <p className="text-[10px] text-gray-500">Rate: {formatCurrency(unitPrice)} + {item.gst}% GST</p>
                    </td>
                    <td className="p-3 text-center font-medium" style={{ color: 'var(--text-primary)' }}>{item.quantity}</td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <input 
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={returnQty || ''}
                          onChange={(e) => handleQtyChange(item.id, item.quantity, parseInt(e.target.value) || 0)}
                          className="w-16 text-center py-1 border rounded bg-white dark:bg-gray-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-rose-500">
                      {refundVal > 0 ? formatCurrency(refundVal) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Refund Amount</p>
            <p className="text-2xl font-black text-rose-500">{formatCurrency(totalRefund)}</p>
          </div>
          <button 
            onClick={handleReturn}
            disabled={totalRefund === 0 || returnMutation.isPending}
            className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
          >
            {returnMutation.isPending ? 'Processing...' : (
              <>
                <ArrowRightLeft className="w-5 h-5" /> Confirm Return
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
