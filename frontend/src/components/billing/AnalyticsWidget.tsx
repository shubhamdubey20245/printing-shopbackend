import { useBillingAnalytics } from '@/hooks/useBilling';
import { formatCurrency } from '@/utils/cn';
import { TrendingUp, FileText, Banknote, CreditCard, Award } from 'lucide-react';

export const AnalyticsWidget = () => {
  const { data: analyticsResponse, isLoading } = useBillingAnalytics();
  const data = analyticsResponse?.data;

  if (isLoading || !data) {
    return <div className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-500/20">
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Sales Today</span>
        </div>
        <p className="text-lg font-black">{formatCurrency(data.salesToday)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1 text-gray-500">
          <FileText className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bills</span>
        </div>
        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{data.billsToday}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1 text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Avg Bill</span>
        </div>
        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(data.averageBill)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1 text-gray-500">
          <Banknote className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Cash Sales</span>
        </div>
        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(data.cashSales)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1 text-gray-500">
          <CreditCard className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">UPI / Card</span>
        </div>
        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(data.upiSales + data.cardSales)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1 text-gray-500">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Top Product</span>
        </div>
        <p className="text-sm font-bold truncate mt-1" style={{ color: 'var(--text-primary)' }}>{data.topProduct}</p>
      </div>
    </div>
  );
};
