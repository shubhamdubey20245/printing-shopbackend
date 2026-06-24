import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { PrintInvoice } from '@/components/billing/PrintInvoice';

export default function PrintInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any>(null);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [saleRes, profileRes] = await Promise.all([
          api.get(`/billing/sales/${id}`),
          api.get(`/settings/store-profile`).catch(() => ({ data: { data: null } }))
        ]);

        if (saleRes.data && saleRes.data.success) {
          setSale(saleRes.data.data);
          if (profileRes.data && profileRes.data.success) {
            setStoreProfile(profileRes.data.data);
          }
          // Wait a brief moment for React to render the component before triggering print
          setTimeout(() => {
            window.print();
          }, 500);
        } else {
          setError('Failed to load invoice data.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching invoice');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-500 animate-pulse">Loading Invoice Data...</p>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl font-bold text-rose-500">{error || 'Invoice not found'}</p>
        <button 
          onClick={() => navigate('/billing')}
          className="px-6 py-2 bg-primary-500 text-white font-bold rounded-lg"
        >
          Return to Billing
        </button>
      </div>
    );
  }

  // Map API Sale data to PrintInvoiceProps
  const printItems = sale.items.map((item: any) => ({
    id: item.id,
    name: item.medicine?.name || 'Unknown',
    pack: item.medicine?.pack_size || '1 Strip',
    hsn: item.medicine?.hsn || '3004',
    batch: item.medicine?.batch_number || '',
    expiry: item.medicine?.expiry_date || '',
    qty: item.quantity,
    mrp: Number(item.medicine?.mrp || item.price),
    rate: Number(item.price),
    discount: 0, // Model has total discount on sale, not per item
    gst: Number(item.gst),
    amount: Number(item.total)
  }));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 print:p-0 print:bg-white print:min-h-0">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Invoice #{sale.invoice_number}</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg"
          >
            Print Again
          </button>
          <button 
            onClick={() => navigate('/billing')}
            className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg"
          >
            Back to Billing
          </button>
        </div>
      </div>
      
      <div className="bg-white max-w-4xl mx-auto shadow-2xl relative print:shadow-none print:max-w-none print:w-full">
        <PrintInvoice 
          invoiceNo={sale.invoice_number}
          date={new Date(sale.created_at)}
          patientName={sale.customer_name || 'Walk-in'}
          patientPhone={sale.customer_phone}
          items={printItems}
          subtotal={Number(sale.subtotal)}
          cgstAmount={Number(sale.gst_amount) / 2}
          sgstAmount={Number(sale.gst_amount) / 2}
          total={Number(sale.total_amount)}
          storeProfile={storeProfile}
        />
      </div>
    </div>
  );
}
