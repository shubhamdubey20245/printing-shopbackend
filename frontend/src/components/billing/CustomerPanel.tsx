import { useCustomerStats } from '@/hooks/useBilling';
import { formatCurrency, formatDate } from '@/utils/cn';
import { User, Award, Calendar, ShoppingBag, CreditCard } from 'lucide-react';

export const CustomerPanel = ({ customerId, name, phone }: { customerId: string | null, name: string, phone: string }) => {
  const { data: statsResponse, isLoading } = useCustomerStats(customerId);
  const stats = statsResponse?.data;

  if (!customerId) {
    return (
      <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100">{name}</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{phone || 'Walk-in Customer'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="card p-4 h-24 animate-pulse bg-gray-100 dark:bg-gray-800"></div>;
  }

  return (
    <div className="card p-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{phone}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800">
            <Award className="w-3 h-3" />
            <span className="text-[10px] font-bold">{stats?.loyaltyPoints || 0} Pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 relative z-10">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <CreditCard className="w-3 h-3" /> Due
          </div>
          <p className="font-bold text-rose-500 text-sm">{formatCurrency(stats?.outstandingBalance || 0)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3 h-3" /> Orders
          </div>
          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{stats?.totalPurchases || 0}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <Calendar className="w-3 h-3" /> Last
          </div>
          <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {stats?.lastPurchaseDate ? formatDate(stats.lastPurchaseDate).split(',')[0] : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
};
