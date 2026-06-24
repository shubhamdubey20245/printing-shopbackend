import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  LineChart, TrendingUp, TrendingDown, Clock, Users, Activity, ShoppingBag, 
  PackageSearch, History, Calendar, Package, UserPlus
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/cn';

interface MedicineInsightsPanelProps {
  medicineId: string;
  customerPhone?: string;
  onApplyRate?: (rate: number, discount: number) => void;
}

const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const MedicineInsightsPanel: React.FC<MedicineInsightsPanelProps> = ({ medicineId, customerPhone, onApplyRate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customer' | 'timeline' | 'batches'>('overview');
  
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<any>(null);
  const [customerHistory, setCustomerHistory] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    if (!medicineId || !isValidUUID(medicineId)) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const [pricingRes, timelineRes, batchesRes] = await Promise.all([
          api.get(`/analytics/medicine/${medicineId}/pricing`),
          api.get(`/analytics/medicine/${medicineId}/timeline`),
          api.get(`/inventory/medicine/${medicineId}/batches`)
        ]);

        if (pricingRes.data.success) setPricing(pricingRes.data.data);
        if (timelineRes.data.success) setTimeline(timelineRes.data.data);
        if (batchesRes.data.success) setBatches(batchesRes.data.data);

        // Always fetch ALL customer history so the pharmacist can see who bought it previously
        const custUrl = `/analytics/medicine/${medicineId}/customer-history`;
          
        const custRes = await api.get(custUrl);
        if (custRes.data.success) setCustomerHistory(custRes.data.data);

      } catch (error) {
        console.error('Error fetching medicine insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [medicineId, customerPhone]);

  if (!medicineId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500 h-full">
        <Activity className="w-12 h-12 mb-4 opacity-30 text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Medicine Selected</h3>
        <p className="text-sm max-w-[250px]">
          Add an item to the invoice to automatically view its intelligence insights here.
        </p>
      </div>
    );
  }

  if (!isValidUUID(medicineId)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-gray-600">
        <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">Intelligence not available</p>
        <p className="text-xs mt-1 opacity-70">This item is from local mock data.<br />Add it via <strong>Inventory</strong> to see insights.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  if (!pricing) return null;

  const profitPerUnit = pricing.current.sellingPrice - pricing.current.purchasePrice;
  const marginPercent = pricing.current.purchasePrice > 0 ? (profitPerUnit / pricing.current.purchasePrice) * 100 : 0;
  const isProfitable = profitPerUnit > 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'customer', label: 'Customer', icon: <Users className="w-4 h-4" /> },
    { id: 'batches', label: 'Batches', icon: <Package className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Profitability Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-indigo-100/50 dark:border-indigo-800/30">
                <h3 className="text-sm font-medium flex items-center text-indigo-700 dark:text-indigo-400">
                  <Activity className="w-4 h-4 mr-2" />
                  Profitability Profile
                </h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Cost Price:</div>
                <div className="font-semibold text-right">{formatCurrency(pricing.current.purchasePrice)}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Selling Price:</div>
                <div className="font-semibold text-right">{formatCurrency(pricing.current.sellingPrice)}</div>
                
                <div className="text-gray-500 dark:text-gray-400 mt-2">Margin:</div>
                <div className="text-right mt-2 flex justify-end items-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${isProfitable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {marginPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Extremes */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium flex items-center">
                  <LineChart className="w-4 h-4 mr-2" />
                  Historical Pricing
                </h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="text-gray-500 text-xs uppercase tracking-wider col-span-2 border-b pb-1">Purchase</div>
                <div className="text-gray-500">Highest Buy:</div><div className="text-right text-rose-600">{formatCurrency(pricing.purchase.highest)}</div>
                <div className="text-gray-500">Lowest Buy:</div><div className="text-right text-emerald-600">{formatCurrency(pricing.purchase.lowest)}</div>
                
                <div className="text-gray-500 text-xs uppercase tracking-wider col-span-2 border-b pb-1 mt-2">Sales</div>
                <div className="text-gray-500">Highest Sale:</div><div className="text-right text-emerald-600">{formatCurrency(pricing.selling.highest)}</div>
                <div className="text-gray-500">Lowest Sale:</div><div className="text-right text-rose-600">{formatCurrency(pricing.selling.lowest)}</div>
              </div>
            </div>

          </div>
        )}

        {/* CUSTOMER TAB */}
        {activeTab === 'customer' && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
            {customerHistory.length > 0 ? (
              <div className="overflow-x-auto max-h-[300px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-gray-500 bg-gray-50 dark:bg-gray-800/50 uppercase border-b border-gray-200 dark:border-gray-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.map((item: any, i: number) => (
                      <tr 
                        key={i} 
                        onClick={() => onApplyRate && onApplyRate(item.rate, item.discount)}
                        className={`border-b last:border-0 border-gray-100 dark:border-gray-800 transition-colors ${onApplyRate ? 'cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        title={onApplyRate ? "Click to apply this rate to the bill" : undefined}
                      >
                        <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{formatDate(item.date).split(',')[0]}</td>
                        <td className="px-4 py-2 font-medium">
                          <div className="text-gray-800 dark:text-gray-200">{item.customerName || 'Walk-in'}</div>
                          <div className="text-[10px] text-gray-500">{item.customerPhone || ''}</div>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right font-semibold text-emerald-600">{formatCurrency(item.rate)}</td>
                        <td className="px-4 py-2 text-right text-rose-500">{item.discount > 0 ? formatCurrency(item.discount) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No prior sales found for this medicine.</p>
              </div>
            )}
          </div>
        )}

        {/* BATCHES TAB */}
        {activeTab === 'batches' && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50 uppercase border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-2">Batch No</th>
                    <th className="px-4 py-2">Expiry</th>
                    <th className="px-4 py-2 text-right">Stock Qty</th>
                    <th className="px-4 py-2 text-right">Purchase Price</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b: any, i: number) => {
                    const isNearExpiry = new Date(b.expiry_date) < new Date(new Date().setMonth(new Date().getMonth() + 3));
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-2 font-bold uppercase">{b.batch_number}</td>
                        <td className={`px-4 py-2 font-medium ${isNearExpiry ? 'text-rose-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {b.expiry_date ? b.expiry_date.substring(0, 7) : 'N/A'}
                          {isNearExpiry && <span className="ml-2 text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Near Expiry</span>}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">{b.stock_quantity}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(b.purchase_price)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm bg-white dark:bg-gray-900 max-h-[400px] overflow-y-auto">
            {timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((event: any, i: number) => (
                  <div key={event.id} className="flex gap-4 relative">
                    {/* Line */}
                    {i !== timeline.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-gray-200 dark:bg-gray-800"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-gray-900 ${
                      event.type === 'SALE' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'PURCHASE' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {event.type === 'SALE' && <TrendingDown className="w-4 h-4" />}
                      {event.type === 'PURCHASE' && <TrendingUp className="w-4 h-4" />}
                      {(event.type !== 'SALE' && event.type !== 'PURCHASE') && <PackageSearch className="w-4 h-4" />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {event.type === 'SALE' ? 'Sold' : event.type === 'PURCHASE' ? 'Purchased' : 'Adjustment'} 
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full font-bold ${event.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {event.quantity > 0 ? '+' : ''}{event.quantity} qty
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 flex gap-2 mt-1">
                            <span>Ref: {event.reference}</span>
                            <span>•</span>
                            <span>{event.notes}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-500">{formatDate(event.date).split(',')[0]}</p>
                          {event.price > 0 && (
                            <p className="text-sm font-bold mt-1 text-gray-900 dark:text-gray-100">{formatCurrency(event.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No activity timeline found.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

