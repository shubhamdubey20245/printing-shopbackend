import React, { forwardRef } from 'react'
import { formatCurrency, formatDate } from '@/utils/cn'
import { numberToWords } from '@/utils/numberToWords'
import { Activity, LineChart, Pill } from 'lucide-react'

interface InvoiceItem {
  id: string
  medId: string
  name: string
  pack: string
  hsn: string
  batch: string
  expiry: string
  qty: number
  freeQty: number
  mrp: number
  rate: number
  discount: number
  gst: number
  amount: number
  notes: string
}

interface PrintInvoiceProps {
  invoiceNo: string
  date: Date
  patientName: string
  patientPhone?: string
  patientAge?: string
  patientGender?: string
  doctorName?: string
  doctorRegNo?: string
  items: InvoiceItem[]
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  total: number
  storeProfile?: any
  interactive?: boolean
  onUpdateItem?: (id: string, field: keyof InvoiceItem, value: any) => void
  onRemoveItem?: (id: string) => void
  onShowIntelligence?: (medId: string) => void
  searchComponent?: React.ReactNode
}

export const PrintInvoice = forwardRef<HTMLDivElement, PrintInvoiceProps>(({
  invoiceNo, date, patientName, patientPhone, patientAge, patientGender, doctorName, doctorRegNo, items, subtotal, cgstAmount, sgstAmount, total, storeProfile,
  interactive, onUpdateItem, onRemoveItem, onShowIntelligence, searchComponent
}, ref) => {
  
  return (
    <div ref={ref} className="w-full bg-white text-gray-900 p-4 md:p-8 print:p-0 font-sans text-[12px] leading-tight mx-auto shadow-sm print:shadow-none relative print:w-[100%]">
      
      <div className="border border-gray-400 print:border-black rounded-sm overflow-hidden bg-white">
        
        {/* Pharmacy Header */}
        <div className="flex border-b border-gray-400 print:border-black bg-gray-50 print:bg-transparent">
          {/* Logo & Store Details */}
          <div className="w-[60%] p-3 border-r border-gray-400 print:border-black flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-500 text-emerald-600 print:border-black print:text-black print:bg-transparent shrink-0">
              <Pill className="w-8 h-8" />
            </div>
            <div className="text-[11px]">
              <h1 className="font-extrabold text-[18px] leading-tight mb-1 text-emerald-800 print:text-black tracking-wide">{storeProfile?.STORE_NAME || 'MEDIFLOW PHARMACY'}</h1>
              <p className="leading-tight text-gray-700 print:text-black">{storeProfile?.STORE_ADDRESS || '123 Health Avenue, Medical District'}</p>
              <p className="leading-tight text-gray-700 print:text-black">{storeProfile?.STORE_CITY || 'Mumbai'}, {storeProfile?.STORE_STATE || 'Maharashtra'} {storeProfile?.STORE_PINCODE || '400001'}</p>
              <p className="leading-tight mt-1 text-gray-700 print:text-black"><span className="font-semibold">Phone:</span> {storeProfile?.STORE_MOBILE || '+91 98765 43210'}</p>
              <p className="leading-tight text-gray-700 print:text-black"><span className="font-semibold">Email:</span> {storeProfile?.STORE_EMAIL || 'contact@mediflow.com'}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="w-[40%] flex flex-col">
            <div className="p-2 border-b border-gray-400 print:border-black bg-emerald-600 text-white print:bg-transparent print:text-black text-center">
              <h2 className="font-bold text-[16px] tracking-widest uppercase">Tax Invoice</h2>
            </div>
            <div className="p-3 text-[11px] flex-1 flex flex-col justify-center gap-1.5 bg-white">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600 print:text-black">Invoice No:</span>
                <span className="font-bold">{invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600 print:text-black">Date:</span>
                <span className="font-bold">{formatDate(date.toISOString()).split(',')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600 print:text-black">Time:</span>
                <span className="font-bold">{new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-semibold text-gray-600 print:text-black">D.L. No:</span>
                <span className="font-bold">{storeProfile?.DRUG_LICENSE_NUMBER || 'MH-MZ4-123456'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="flex border-b border-gray-400 print:border-black bg-white">
          <div className="w-[50%] p-2 px-3 border-r border-gray-400 print:border-black text-[11px]">
            <p className="text-[10px] font-bold text-emerald-600 print:text-gray-600 uppercase tracking-wider mb-1">Billed To</p>
            <div className="flex mb-0.5"><span className="w-20 font-semibold text-gray-600 print:text-black">Patient Name</span><span className="mr-1">:</span><span className="font-bold capitalize">{patientName || 'Cash Customer'} {patientAge ? `(${patientAge}Y)` : ''} {patientGender ? `[${patientGender.charAt(0)}]` : ''}</span></div>
            <div className="flex"><span className="w-20 font-semibold text-gray-600 print:text-black">Phone</span><span className="mr-1">:</span><span>{patientPhone || 'N/A'}</span></div>
          </div>
          <div className="w-[50%] p-2 px-3 text-[11px]">
            <p className="text-[10px] font-bold text-emerald-600 print:text-gray-600 uppercase tracking-wider mb-1">Prescribed By</p>
            <div className="flex mb-0.5"><span className="w-20 font-semibold text-gray-600 print:text-black">Doctor Name</span><span className="mr-1">:</span><span className="font-bold capitalize">{doctorName ? `Dr. ${doctorName}` : 'Self'}</span></div>
            <div className="flex"><span className="w-20 font-semibold text-gray-600 print:text-black">Reg No.</span><span className="mr-1">:</span><span>{doctorRegNo || 'N/A'}</span></div>
          </div>
        </div>

        {/* Excel-style Grid Table */}
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-100 print:bg-gray-100">
            <tr className="border-b border-gray-400 print:border-black text-left text-[10px] font-extrabold text-gray-700 print:text-black uppercase tracking-wider">
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[4%] text-center">#</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[26%]">Item Description</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[8%] text-center">Pack</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[10%] text-center">Batch</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[7%] text-center">Exp</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[7%] text-right bg-blue-50/50 print:bg-transparent">Qty</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[8%] text-right">MRP</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[8%] text-right">Rate</th>
              <th className="border-r border-gray-400 print:border-black p-1.5 w-[8%] text-center">GST%</th>
              <th className="p-1.5 w-[14%] text-right bg-emerald-50 print:bg-transparent">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="text-[11px] group relative font-medium border-b border-gray-200 print:border-gray-400 even:bg-gray-50/50 print:even:bg-transparent hover:bg-emerald-50/30 transition-colors bg-white">
                <td className="border-r border-gray-400 print:border-black p-1.5 text-center align-top relative">
                  {interactive && (
                    <button 
                      onClick={() => onRemoveItem?.(item.id)} 
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden shadow-md"
                    >
                      ×
                    </button>
                  )}
                  {index + 1}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 font-bold align-top truncate group/name">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate flex-1 text-gray-900 print:text-black">{item.name}</span>
                    {interactive && (
                      <button 
                        onClick={() => onShowIntelligence?.(item.medId)}
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded border border-indigo-200 dark:border-indigo-800/30 transition-all opacity-60 group-hover/name:opacity-100 print:hidden"
                        title="Medicine Intelligence"
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold">Insights</span>
                      </button>
                    )}
                  </div>
                  {item.hsn && <div className="text-[9px] text-gray-500 print:text-gray-600 font-normal mt-0.5">HSN: {item.hsn}</div>}
                </td>

                <td className="border-r border-gray-400 print:border-black p-1.5 align-top text-center text-gray-700 print:text-black break-all">
                  {interactive ? (
                    <input 
                      type="text" 
                      value={item.pack || ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'pack', e.target.value)}
                      className="w-full text-center bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all text-[11px]"
                    />
                  ) : item.pack}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 align-top text-center font-semibold text-gray-800 print:text-black break-all uppercase">
                  {interactive ? (
                    <input 
                      type="text" 
                      value={item.batch || ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'batch', e.target.value)}
                      className="w-full text-center bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all text-[11px] uppercase"
                    />
                  ) : item.batch}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 text-center align-top text-gray-700 print:text-black">
                  {interactive ? (
                    <input 
                      type="text" 
                      value={item.expiry ? (item.expiry.length === 10 && item.expiry.includes('-') ? `${item.expiry.substring(5, 7)}/${item.expiry.substring(2, 4)}` : item.expiry) : ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'expiry', e.target.value)}
                      className="w-full text-center bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all text-[11px]"
                      placeholder="MM/YY"
                    />
                  ) : (item.expiry ? (item.expiry.length === 10 && item.expiry.includes('-') ? `${item.expiry.substring(5, 7)}/${item.expiry.substring(2, 4)}` : item.expiry) : '')}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 text-right font-extrabold text-blue-700 print:text-black align-top bg-blue-50/30 print:bg-transparent">
                  {interactive ? (
                    <input 
                      type="number" 
                      value={item.qty || ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'qty', parseInt(e.target.value) || 1)}
                      className="w-full text-right font-bold text-blue-700 bg-transparent border border-transparent hover:border-blue-300 rounded px-1 py-0.5 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  ) : item.qty}
                </td>

                <td className="border-r border-gray-400 print:border-black p-1.5 text-right align-top text-gray-600 print:text-black">
                  {interactive ? (
                    <input 
                      type="number" 
                      value={item.mrp || ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'mrp', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  ) : Number(item.mrp || 0).toFixed(2)}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 text-right align-top font-bold text-gray-800 print:text-black">
                  {interactive ? (
                    <input 
                      type="number" 
                      value={item.rate || ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full text-right font-bold bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  ) : Number(item.rate || 0).toFixed(2)}
                </td>
                <td className="border-r border-gray-400 print:border-black p-1.5 text-center align-top text-gray-600 print:text-black">
                  {interactive ? (
                    <input 
                      type="number" 
                      value={item.gst ? item.gst : ''}
                      onChange={(e) => onUpdateItem?.(item.id, 'gst', (parseFloat(e.target.value) || 0))}
                      className="w-full text-center bg-transparent border border-transparent hover:border-gray-300 rounded px-1 py-0.5 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  ) : (item.gst ? `${item.gst}%` : '0%')}
                </td>
                
                <td className="p-1.5 text-right font-extrabold text-[12px] align-top bg-emerald-50/50 print:bg-transparent text-emerald-900 print:text-black">
                  {Number(item.amount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
            
            {interactive && searchComponent && (
              <tr className="text-[12px] bg-white print:hidden relative group border-b border-gray-200">
                <td className="border-r border-gray-400 p-1.5 text-center font-bold text-emerald-600">*</td>
                <td colSpan={9} className="p-0 relative">
                  {searchComponent}
                </td>
              </tr>
            )}

            {/* Fill empty rows to maintain grid structure */}
            {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="text-[11px] border-b border-gray-200 print:border-gray-400 last:border-b-0 bg-white">
                <td className="border-r border-gray-400 print:border-black p-1.5">&nbsp;</td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5 bg-blue-50/10 print:bg-transparent"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="border-r border-gray-400 print:border-black p-1.5"></td>
                <td className="p-1.5 bg-emerald-50/10 print:bg-transparent"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations / Summary Section */}
        <div className="flex border-t border-gray-400 print:border-black text-[11px] items-stretch bg-white">
          <div className="w-[60%] p-3 border-r border-gray-400 print:border-black flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-500 print:text-gray-600 uppercase text-[9px] tracking-wider mb-1">Amount in Words</p>
              <p className="font-semibold text-gray-800 print:text-black italic">Rupees {numberToWords(Math.round(total))} Only</p>
            </div>
            
            <div className="mt-4 flex gap-4">
               <div className="bg-gray-50 print:bg-transparent border border-gray-200 print:border-gray-400 p-2 rounded-sm print:rounded-none flex-1">
                 <p className="font-bold text-[9px] text-gray-500 print:text-gray-600 uppercase mb-1">Total Savings</p>
                 <p className="font-extrabold text-emerald-600 print:text-black text-[13px]">Rs. {((items.reduce((sum, i) => sum + (Number(i.mrp || 0) * Number(i.qty || 0)), 0)) - total).toFixed(2)}</p>
               </div>
               <div className="bg-gray-50 print:bg-transparent border border-gray-200 print:border-gray-400 p-2 rounded-sm print:rounded-none flex-1">
                 <p className="font-bold text-[9px] text-gray-500 print:text-gray-600 uppercase mb-1">Total Items</p>
                 <p className="font-bold text-gray-800 print:text-black text-[13px]">{items.length}</p>
               </div>
            </div>
          </div>
          
          <div className="w-[40%] flex flex-col font-medium text-gray-700 print:text-black">
            <div className="flex justify-between p-2 border-b border-gray-200 print:border-gray-400">
              <span>Gross Amount</span>
              <span className="font-bold">Rs. {Number(subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-200 print:border-gray-400 text-[10px]">
              <span>Total CGST</span>
              <span>Rs. {Number(cgstAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-400 print:border-black text-[10px]">
              <span>Total SGST</span>
              <span>Rs. {Number(sgstAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 bg-emerald-50 print:bg-transparent items-center flex-1">
              <span className="font-extrabold text-[14px] text-emerald-900 print:text-black uppercase">Grand Total</span>
              <span className="font-black text-[18px] text-emerald-700 print:text-black">Rs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer: Terms & Bank */}
        <div className="flex border-t border-gray-400 print:border-black text-[10px] bg-white">
          <div className="w-[60%] p-3 border-r border-gray-400 print:border-black flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-800 print:text-black mb-1 uppercase tracking-wider text-[9px]">Terms & Conditions</p>
              <ul className="list-disc list-inside text-gray-600 print:text-gray-800 space-y-0.5 ml-1 text-[9px]">
                <li>Goods once sold will not be taken back or exchanged.</li>
                <li>Bills not paid by due date will attract 24% interest p.a.</li>
                <li>All disputes subject to local jurisdiction only.</li>
              </ul>
            </div>
            <div className="mt-3 bg-gray-50 print:bg-transparent p-2 border border-gray-200 print:border-gray-400 rounded-sm print:rounded-none">
              <p className="font-bold text-gray-800 print:text-black text-[9px] uppercase mb-1">Bank Details for NEFT/RTGS</p>
              <div className="flex gap-4 text-[9px]">
                <div><span className="text-gray-500 print:text-gray-700">Bank:</span> <span className="font-semibold">AXIS BANK</span></div>
                <div><span className="text-gray-500 print:text-gray-700">A/C:</span> <span className="font-semibold">920010041422557</span></div>
                <div><span className="text-gray-500 print:text-gray-700">IFSC:</span> <span className="font-semibold">UTIB0004602</span></div>
              </div>
            </div>
          </div>
          <div className="w-[40%] flex flex-col justify-end items-center p-3">
            <div className="w-full text-center mt-8 pt-2 border-t border-dashed border-gray-400 print:border-black text-gray-600 print:text-black">
              <p className="font-bold text-[11px]">{storeProfile?.STORE_NAME || 'MEDIFLOW PHARMACY'}</p>
              <p className="text-[9px] mt-0.5 uppercase tracking-wider">Authorised Signatory</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Print footer message */}
      <div className="hidden print:block text-center mt-4 text-[10px] font-bold text-gray-500 italic">
        ~ Thank you for your visit. Wish you a speedy recovery! ~
      </div>
    </div>
  )
})

PrintInvoice.displayName = 'PrintInvoice'
