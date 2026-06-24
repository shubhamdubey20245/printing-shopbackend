import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, Minus, X, CreditCard, Banknote, 
  Smartphone, Wallet, Printer, UserPlus, Globe, CheckCircle2, AlertCircle, Users, ScanLine, History, PauseCircle, Trash2, Save, FolderOpen, FilePlus, Download, Activity, ArrowLeft, LineChart
} from 'lucide-react'
import { globalCatalog, type GlobalProduct } from '@/data/globalCatalog'
import { formatCurrency } from '@/utils/cn'
import { PrintInvoice } from '@/components/billing/PrintInvoice'
import { BarcodeScanner } from '@/components/billing/BarcodeScanner'
import api from '@/lib/api'
import html2pdf from 'html2pdf.js'
import { useBillingStore } from '@/store/useBillingStore'
import { MedicineInsightsPanel } from '@/components/billing/MedicineInsightsPanel'
import { PatientDetailsModal } from '@/components/billing/PatientDetailsModal'
import { DoctorDetailsModal } from '@/components/billing/DoctorDetailsModal'
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';

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
  isExternal?: boolean
  margin: number
}

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [patient, setPatient] = useState({ name: '', phone: '', age: '', gender: '' })
  const [patientDiscount, setPatientDiscount] = useState(0)
  const [isPatientFound, setIsPatientFound] = useState<boolean | null>(null)
  const [doctor, setDoctor] = useState({ id: '', name: '', regNo: '', phone: '' })
  const [isDoctorFound, setIsDoctorFound] = useState<boolean | null>(null)
  
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showPatientPromptModal, setShowPatientPromptModal] = useState(false)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [showDoctorPromptModal, setShowDoctorPromptModal] = useState(false)
  const [invoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`)
  const [date] = useState(new Date())
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null)
  const navigate = useNavigate()

  const [showGlobalIntelligence, setShowGlobalIntelligence] = useState(false)

  // Modals state
  const [showRecentBillsModal, setShowRecentBillsModal] = useState(false)
  const [showDraftsModal, setShowDraftsModal] = useState(false)
  const [billsList, setBillsList] = useState<any[]>([])
  const [isLoadingBills, setIsLoadingBills] = useState(false)

  // Scanner State
  const [showScanner, setShowScanner] = useState(false)
  const [scanMessage, setScanMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  // External Item Modal State
  const [selectedExternal, setSelectedExternal] = useState<GlobalProduct | null>(null)

  // Smart Substitute State
  const [suggestedSubstitute, setSuggestedSubstitute] = useState<{
    originalId: string;
    substituteMed: any;
    marginDiff: number;
  } | null>(null)

  // Insights State
  const [selectedMedicineIdForInsights, setSelectedMedicineIdForInsights] = useState<string | null>(null)

  // Live API Medicine Search
  const [dbMedicines, setDbMedicines] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced Patient & Doctor Lookups
  useEffect(() => {
    const searchPatient = async () => {
      if (patient.phone.length === 10) {
        try {
          const res = await api.get(`/customers?search=${patient.phone}`)
          const data = res.data.data
          if (data && data.length > 0) {
            const found = data.find((c: any) => c.phone === patient.phone)
            if (found) {
              setPatient({ name: found.name, phone: found.phone, age: found.age?.toString() || '', gender: found.gender || '' })
              setPatientDiscount(found.discount_percent || 0)
              setIsPatientFound(true)
            } else {
              setIsPatientFound(false)
            }
          } else {
            setIsPatientFound(false)
          }
        } catch (err) {
          console.error('Error finding patient:', err)
          setIsPatientFound(false)
        }
      } else {
        setIsPatientFound(null)
        setPatientDiscount(0)
      }
    }
    const timer = setTimeout(searchPatient, 500)
    return () => clearTimeout(timer)
  }, [patient.phone])

  useEffect(() => {
    const searchDoctor = async () => {
      if (doctor.phone.length === 10) {
        try {
          const res = await api.get(`/doctors?search=${doctor.phone}`)
          const data = res.data.data
          if (data && data.length > 0) {
            const found = data.find((d: any) => d.phone === doctor.phone)
            if (found) {
              setDoctor({ id: found.id, name: found.name, phone: found.phone, regNo: found.registration_number || '' })
              setIsDoctorFound(true)
            } else {
              setIsDoctorFound(false)
            }
          } else {
            setIsDoctorFound(false)
          }
        } catch (err) {
          console.error('Error finding doctor:', err)
          setIsDoctorFound(false)
        }
      } else {
        setIsDoctorFound(null)
      }
    }
    const timer = setTimeout(searchDoctor, 500)
    return () => clearTimeout(timer)
  }, [doctor.phone])

  const handlePatientPhoneBlur = async () => {
    if (patient.phone.length === 10) {
      if (isPatientFound === false) {
        setShowPatientPromptModal(true)
      } else if (isPatientFound === null) {
        try {
          const res = await api.get(`/customers?search=${patient.phone}`)
          const data = res.data.data
          const found = data?.find((c: any) => c.phone === patient.phone)
          if (found) {
             setPatient(prev => ({...prev, name: found.name, age: found.age?.toString() || '', gender: found.gender || ''}))
             setPatientDiscount(found.discount_percent || 0)
             setIsPatientFound(true)
          } else {
             setIsPatientFound(false)
             setShowPatientPromptModal(true)
          }
        } catch {
             setIsPatientFound(false)
             setShowPatientPromptModal(true)
        }
      }
    }
  }

  const handleDoctorPhoneBlur = async () => {
    if (doctor.phone.length === 10) {
      if (isDoctorFound === false) {
        setShowDoctorPromptModal(true)
      } else if (isDoctorFound === null) {
        try {
          const res = await api.get(`/doctors?search=${doctor.phone}`)
          const data = res.data.data
          const found = data?.find((d: any) => d.phone === doctor.phone)
          if (found) {
             setDoctor(prev => ({...prev, id: found.id, name: found.name, regNo: found.reg_no || ''}))
             setIsDoctorFound(true)
          } else {
             setIsDoctorFound(false)
             setShowDoctorPromptModal(true)
          }
        } catch {
             setIsDoctorFound(false)
             setShowDoctorPromptModal(true)
        }
      }
    }
  }

  const searchInputRef = useRef<HTMLInputElement>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedExternal) {
        if (e.key === 'Escape') setSelectedExternal(null)
        if (e.key === 'Enter') addExternalItemToBill(selectedExternal)
        return
      }

      if (e.key === 'F2') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'F9') {
        e.preventDefault()
        handlePrint()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedExternal, items])

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.rate * item.qty), 0)
  const totalDiscount = items.reduce((sum, item) => sum + ((item.rate * item.qty * item.discount) / 100), 0)
  const taxableValue = subtotal - totalDiscount
  const totalGst = items.reduce((sum, item) => {
    const itemTaxable = (item.rate * item.qty) * (1 - item.discount / 100)
    return sum + (itemTaxable * item.gst) / 100
  }, 0)
  const cgst = totalGst / 2
  const sgst = totalGst / 2
  
  const rawTotal = taxableValue + totalGst
  const grandTotal = Math.round(rawTotal)
  const roundOff = grandTotal - rawTotal

  // Debounced API Search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setDbMedicines([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/medicines?search=${encodeURIComponent(searchTerm)}&limit=20`)
        if (res.data.success) {
          setDbMedicines(res.data.data)
        }
      } catch {
        setDbMedicines([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])


  // Hybrid Search Results: DB medicines first, then global catalog, then custom
  const getSearchResults = () => {
    if (!searchTerm || searchTerm.length < 2) return []
    const q = searchTerm.toLowerCase()

    // 1. Real DB medicines (already filtered by API)
    const localResults = dbMedicines.map((m: any) => ({ ...m, source: 'local' as const }))
    const localNames = new Set(localResults.map((m: any) => m.name.toLowerCase()))

    // 2. Global catalog fallback (exclude names in DB results)
    const fuseGlobal = new Fuse(globalCatalog, {
      keys: ['name', 'genericName'],
      threshold: 0.4,
      ignoreLocation: true
    })
    const globalResults = fuseGlobal.search(q)
      .map(res => res.item)
      .filter(g => !localNames.has(g.name.toLowerCase()))
      .map(g => ({ ...g, source: 'global' as const }))

    const customResult = {
      id: 'custom-' + q,
      name: `Add Custom: "${searchTerm}"`,
      source: 'custom' as const,
      isExternal: true,
      mrp: 0, stock_quantity: 0,
      batch_number: '', expiry_date: '',
      generic_name: searchTerm,
      selling_price: 0, purchase_price: 0, gst_percentage: 0
    }
    return [...localResults, ...globalResults, customResult]
  }

  const searchResults = getSearchResults()

  const handleItemClick = (result: any) => {
    if (result.source === 'global') {
      setSelectedExternal(result)
    } else if (result.source === 'custom') {
      addExternalItemToBill({
        id: 'custom-' + Date.now(),
        name: searchTerm,
        unit: '1 Unit',
        hsn: '',
        mrp: 0,
        gstRate: 0,
        genericName: searchTerm,
      } as any)
    } else {
      addLocalItemToBill(result)
    }
    setSearchTerm('')
  }


  const loadBills = async (status: string) => {
    setIsLoadingBills(true)
    try {
      const res = await api.get(`/billing/sales?status=${status}`)
      if (res.data.success) {
        setBillsList(res.data.data)
      }
    } catch (err) {
      console.error(err)
      alert(`Failed to load ${status.toLowerCase()}s`)
    } finally {
      setIsLoadingBills(false)
    }
  }

  const handleRecentBillsClick = () => {
    loadBills('COMPLETED')
    setShowRecentBillsModal(true)
  }

  const handleLoadDraftClick = () => {
    loadBills('DRAFT')
    setShowDraftsModal(true)
  }

  const handleSaveDraft = async () => {
    if (items.length === 0) return alert('No items to save as draft')
    try {
      const payload = {
        customer_name: patient.name,
        customer_phone: patient.phone,
        patient_age: patient.age,
        patient_gender: patient.gender,
        doctor_name: doctor.name,
        doctor_reg_no: doctor.regNo,
        items: items.map(i => {
          const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(i.medId);
          return {
            medicine_id: isUuid ? i.medId : undefined,
            name: i.name,
            quantity: i.qty,
            price: i.rate,
            gst: i.gst,
            total: i.amount,
            isExternal: !isUuid || i.isExternal,
            batch: i.batch,
            expiry: i.expiry,
            mrp: i.mrp
          };
        }),
        status: 'DRAFT'
      }

      let res
      if (currentSaleId) {
        res = await api.put(`/billing/sale/${currentSaleId}`, payload)
      } else {
        res = await api.post('/billing/sale', payload)
      }

      if (res.data.success) {
        setScanMessage({ type: 'success', text: 'Draft saved successfully' })
        setTimeout(() => setScanMessage(null), 3000)
        setCurrentSaleId(res.data.data.id)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save draft')
    }
  }

  const loadDraftIntoUI = (draft: any) => {
    setCurrentSaleId(draft.id)
    setPatient({
      name: draft.customer_name || 'Walk-in Patient',
      phone: draft.customer_phone || '',
      age: draft.patient_age || '',
      gender: draft.patient_gender || ''
    })
    setDoctor({
      id: draft.doctor_id || '',
      name: draft.doctor_name || '',
      phone: draft.doctor_phone || '',
      regNo: draft.doctor_reg_no || ''
    })
    const loadedItems: InvoiceItem[] = draft.items.map((i: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      medId: i.medicine_id,
      name: i.medicine?.name || i.name || 'Item',
      pack: i.medicine?.unit || 'Unit',
      hsn: i.medicine?.hsn || 'HSN',
      batch: i.medicine?.batch_number || 'Batch',
      expiry: i.medicine?.expiry_date || 'Expiry',
      qty: i.quantity,
      mrp: i.medicine?.mrp || i.price,
      rate: i.price,
      discount: 0,
      gst: i.gst,
      amount: i.total,
      margin: 0
    }))
    setItems(loadedItems)
    setShowDraftsModal(false)
  }

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    
    const element = printRef.current;
    element.style.display = 'block';

    const opt = {
      margin:       0.5,
      filename:     `${invoiceNo}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
    });
  }

  const handleFinalizeBill = async () => {
    if (items.length === 0) return alert('No items in bill')
    try {
      const payload = {
        customer_name: patient.name,
        customer_phone: patient.phone,
        patient_age: patient.age ? Number(patient.age) : null,
        patient_gender: patient.gender,
        doctor_name: doctor.name,
        doctor_reg_no: doctor.regNo,
        payment_method: paymentMethod,
        discount: 0,
        amount_received: grandTotal,
        items: items.map(i => {
          const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(i.medId);
          return {
            medicine_id: isUuid ? i.medId : undefined,
            name: i.name,
            quantity: Number(i.qty),
            price: Number(i.rate),
            gst: Number(i.gst),
            total: Number(i.amount),
            isExternal: !isUuid || i.isExternal,
            batch: i.batch,
            expiry: (() => {
              if (i.expiry && i.expiry.length === 5 && i.expiry.includes('/')) {
                const [m, y] = i.expiry.split('/');
                return `20${y}-${m}-01`;
              }
              return i.expiry;
            })(),
            mrp: Number(i.mrp),
            free_qty: Number(i.freeQty),
            notes: i.notes
          };
        }),
        status: 'COMPLETED'
      }

      let res
      if (currentSaleId) {
        res = await api.put(`/billing/sale/${currentSaleId}`, payload)
      } else {
        res = await api.post('/billing/sale', payload)
      }

      if (res.data.success) {
        handlePrint()
        
        setItems([])
        setPatient({ name: 'Walk-in Patient', phone: '', age: '', gender: '' })
        setDoctor({ id: '', name: '', phone: '', regNo: '' })
        setCurrentSaleId(null)
        setShowCheckout(false)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to process sale')
    }
  }

  const addLocalItemToBill = (med: any) => {
    // 1. Add item to cart
    const existingItem = items.find(i => i.medId === med.id)
    if (existingItem) {
      setItems(items.map(i => i.medId === med.id ? { ...i, qty: i.qty + 1, amount: calculateAmount(i.qty + 1, i.rate, i.discount) } : i))
    } else {
      // Support both API field names (selling_price) and mock field names (sellingPrice)
      const sellingPrice = med.selling_price ?? med.sellingPrice ?? 0
      const purchasePrice = med.purchase_price ?? med.purchasePrice ?? 0
      const gstRate = med.gst_percentage ?? med.gstRate ?? 12
      const margin = sellingPrice - purchasePrice

      const newItem: InvoiceItem = {
        id: Math.random().toString(36).substr(2, 9),
        medId: med.id,
        name: med.name,
        pack: med.unit || '10 Tabs',
        hsn: med.hsn || '3004',
        batch: med.batch_number ?? med.batchNo ?? '',
        expiry: med.expiry_date ?? med.expiryDate ?? '',
        qty: 1,
        freeQty: 0,
        mrp: med.mrp ?? sellingPrice,
        rate: sellingPrice,
        discount: 0,
        gst: gstRate,
        amount: sellingPrice,
        notes: '',
        margin
      }
      setItems([...items, newItem])
    }

    // 2. Smart Substitute — only from DB results that share generic name
    const sellingPrice = med.selling_price ?? med.sellingPrice ?? 0
    const purchasePrice = med.purchase_price ?? med.purchasePrice ?? 0
    const currentMargin = sellingPrice - purchasePrice
    const betterGeneric = dbMedicines.find((m: any) =>
      (m.generic_name || m.genericName) === (med.generic_name || med.genericName) &&
      m.id !== med.id &&
      (m.stock_quantity ?? m.stock ?? 0) > 0 &&
      ((m.selling_price ?? m.sellingPrice ?? 0) - (m.purchase_price ?? m.purchasePrice ?? 0)) > currentMargin
    )

    if (betterGeneric) {
      const newMargin = (betterGeneric.selling_price ?? 0) - (betterGeneric.purchase_price ?? 0)
      setSuggestedSubstitute({
        originalId: med.id,
        substituteMed: betterGeneric,
        marginDiff: newMargin - currentMargin
      })
    } else {
      setSuggestedSubstitute(null)
    }

    searchInputRef.current?.focus()
  }


  const addExternalItemToBill = (globalMed: GlobalProduct) => {
    const existingItem = items.find(i => i.medId === globalMed.id)
    if (existingItem) {
      setItems(items.map(i => i.medId === globalMed.id ? { ...i, qty: i.qty + 1, amount: calculateAmount(i.qty + 1, i.rate, i.discount) } : i))
    } else {
      const newItem: InvoiceItem = {
        id: Math.random().toString(36).substr(2, 9),
        medId: globalMed.id,
        name: globalMed.name,
        pack: globalMed.unit || '1 Piece',
        hsn: globalMed.hsn,
        batch: 'EXT-' + Math.floor(Math.random()*1000), // Placeholder for external
        expiry: '2026-12-31', // Placeholder
        qty: 1,
        freeQty: 0,
        mrp: globalMed.mrp,
        rate: globalMed.mrp * 0.8, // Mock rate assuming 20% margin
        discount: 0,
        gst: globalMed.gstRate,
        amount: globalMed.mrp * 0.8,
        notes: '',
        isExternal: true,
        margin: 0 // External items margin calculated differently
      }
      setItems([...items, newItem])
    }
    setSelectedExternal(null)
    setSuggestedSubstitute(null) // Clear any previous suggestions
    searchInputRef.current?.focus()
  }

  // Handle Barcode Scan
  const handleScan = (barcode: string) => {
    // 1. Search Local Inventory
    const localMed = dbMedicines.find((m: any) => m.barcode === barcode)
    if (localMed) {
      addLocalItemToBill(localMed)
      setScanMessage({ type: 'success', text: `Added ${localMed.name} to bill` })
      setTimeout(() => setScanMessage(null), 2000)
      return
    }

    // 2. Search Global Catalog
    const globalMed = globalCatalog.find(g => g.barcode === barcode)
    if (globalMed) {
      addExternalItemToBill(globalMed)
      setScanMessage({ type: 'success', text: `Added ${globalMed.name} (External) to bill` })
      setTimeout(() => setScanMessage(null), 2000)
      return
    }

    // 3. Not Found
    setScanMessage({ type: 'error', text: `Barcode ${barcode} not recognized` })
    setTimeout(() => setScanMessage(null), 3000)
  }

  const handleSwapSubstitute = () => {
    if (!suggestedSubstitute) return;
    
    // Find the cart item id of the original med
    const cartItem = items.find(i => i.medId === suggestedSubstitute.originalId);
    if (cartItem) {
      // Remove original
      const newItems = items.filter(i => i.id !== cartItem.id);
      setItems(newItems);
      // We need to use setTimeout so the state update clears before adding the new one
      setTimeout(() => {
        addLocalItemToBill(suggestedSubstitute.substituteMed);
        setSuggestedSubstitute(null); // Explicitly clear so it doesn't suggest infinitely
      }, 0);
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        updatedItem.amount = calculateAmount(updatedItem.qty, updatedItem.rate, updatedItem.discount)
        return updatedItem
      }
      return item
    }))
  }

  const calculateAmount = (qty: number, rate: number, discount: number) => {
    return (qty * rate) * (1 - discount / 100)
  }

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

  const handlePrint = () => {
    if (items.length === 0) return alert('Please add items to bill first.')
    window.print()
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCheckout) {
        setShowCheckout(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showCheckout])

  // Register all action callbacks with the BillingSubSidebar store
  const { register, unregister } = useBillingStore()
  useEffect(() => {
    register({
      newBill: () => {
        setItems([])
        setPatient({ name: 'Walk-in Patient', phone: '', age: '', gender: '' })
        setDoctor({ id: '', name: '', phone: '', regNo: '' })
        setCurrentSaleId(null)
      },
      saveDraft: handleSaveDraft,
      loadDraft: handleLoadDraftClick,
      openScanner: () => setShowScanner(true),
      openRecentBills: handleRecentBillsClick,
      openCheckout: () => setShowCheckout(true),
      printInvoice: handlePrint,
      downloadPDF: handleDownloadPDF,
      clearBill: () => setItems([]),
    })
    return () => unregister()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, patient, doctor, showCheckout])

  const quickCustomers = ['Walk-in', 'Anita Sharma', 'Rakesh Verma', 'Priya Iyer', 'Mohammed Khan']

  const patientPhoneRef = useRef<HTMLInputElement>(null)
  const doctorPhoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        doctorPhoneRef.current?.focus()
      } else if (e.key === 'F2') {
        e.preventDefault()
        patientPhoneRef.current?.focus()
      } else if (e.key === 'F3') {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'F9') {
        e.preventDefault()
        setShowCheckout(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)] print:hidden bg-white dark:bg-[#12121a] text-gray-800 dark:text-gray-200 overflow-hidden shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 font-sans relative">
        
        {/* Top Action Bar (POS Header) */}
        <div className="bg-white dark:bg-[#1a1a24] text-gray-800 dark:text-gray-200 flex justify-between items-center px-4 py-3 shadow-sm border-b border-gray-200 dark:border-gray-800 z-10 shrink-0">
          <div className="flex items-center gap-2">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 hover:text-gray-900 dark:hover:text-white group flex items-center gap-2">
               <ArrowLeft className="w-5 h-5" />
               <span className="font-bold text-sm hidden sm:inline">Back</span>
             </button>
             <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
             
             <button onClick={() => {
                setItems([])
                setPatient({ name: 'Walk-in Patient', phone: '', age: '', gender: '' })
                setDoctor({ id: '', name: '', phone: '', regNo: '' })
                setCurrentSaleId(null)
             }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-900/30 dark:text-emerald-400 font-medium text-sm transition-colors">
                <FilePlus className="w-4 h-4" /> <span className="hidden sm:inline">New Bill</span>
             </button>
             <button onClick={handleRecentBillsClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/30 dark:text-blue-400 font-medium text-sm transition-colors">
                <History className="w-4 h-4" /> <span className="hidden lg:inline">Recent</span>
             </button>
             <button onClick={handleLoadDraftClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 dark:hover:bg-indigo-900/30 dark:text-indigo-400 font-medium text-sm transition-colors">
                <FolderOpen className="w-4 h-4" /> <span className="hidden lg:inline">Drafts</span>
             </button>
          </div>

          <div className="hidden md:flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black tracking-widest text-sm uppercase">
                <Activity className="w-4 h-4" /> POS
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
             <span className="font-mono text-sm text-gray-600 dark:text-gray-400">#{invoiceNo}</span>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
             <span className="text-xs text-gray-500 font-medium">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => setShowScanner(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-cyan-50 text-cyan-600 dark:hover:bg-cyan-900/30 dark:text-cyan-400 font-medium text-sm transition-colors">
                <ScanLine className="w-4 h-4" /> <span className="hidden lg:inline">Scan</span>
             </button>
             <button onClick={handleSaveDraft} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-amber-50 text-amber-600 dark:hover:bg-amber-900/30 dark:text-amber-400 font-medium text-sm transition-colors">
                <Save className="w-4 h-4" /> <span className="hidden lg:inline">Save</span>
             </button>
             <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-teal-50 text-teal-600 dark:hover:bg-teal-900/30 dark:text-teal-400 font-medium text-sm transition-colors">
                <Download className="w-4 h-4" /> <span className="hidden lg:inline">PDF</span>
             </button>
             <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
             <button onClick={() => setItems([])} className="flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-900/30 transition-colors" title="Clear Bill">
                <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Data Entry Header (Dense Modern) */}
        <div className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-3 flex flex-col gap-2 shrink-0 relative z-10">
           {/* Patient Row */}
           <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all flex-1 max-w-sm">
                 <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 text-xs font-bold border-r border-gray-200 dark:border-gray-700 flex items-center gap-1">
                    Patient
                 </div>
                 <input 
                   ref={patientPhoneRef}
                   type="text" placeholder="Phone No." value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})}
                   onBlur={handlePatientPhoneBlur}
                   className="w-28 px-2 py-1 text-xs bg-transparent outline-none font-mono"
                 />
                 <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700"></div>
                 <input 
                   type="text" placeholder="Name" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})}
                   className="flex-1 px-2 py-1 text-xs bg-transparent outline-none font-medium"
                 />
              </div>
              <div className="flex items-center bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
                 <input 
                   type="text" placeholder="Age" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})}
                   className="w-12 px-2 py-1 text-xs bg-transparent outline-none text-center"
                 />
                 <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700"></div>
                 <select 
                   value={patient.gender} onChange={e => setPatient({...patient, gender: e.target.value})}
                   className="w-14 px-1 py-1 text-xs bg-transparent outline-none appearance-none text-center cursor-pointer"
                 >
                   <option value="">Sex</option><option value="Male">M</option><option value="Female">F</option>
                 </select>
              </div>

              {isPatientFound === true && (
                 <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Found ({patientDiscount}%)</span>
              )}
           </div>

           {/* Doctor Row */}
           <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all flex-1 max-w-sm">
                 <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 text-xs font-bold border-r border-gray-200 dark:border-gray-700 flex items-center gap-1">
                    Doctor
                 </div>
                 <input 
                   ref={doctorPhoneRef}
                   type="text" placeholder="Phone No." value={doctor.phone} onChange={e => setDoctor({...doctor, phone: e.target.value})}
                   onBlur={handleDoctorPhoneBlur}
                   className="w-28 px-2 py-1 text-xs bg-transparent outline-none font-mono"
                 />
                 <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700"></div>
                 <input 
                   type="text" placeholder="Name" value={doctor.name} onChange={e => setDoctor({...doctor, name: e.target.value})}
                   className="flex-1 px-2 py-1 text-xs bg-transparent outline-none font-medium"
                 />
              </div>
              <div className="flex items-center bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                 <input 
                   type="text" placeholder="Reg. No" value={doctor.regNo} onChange={e => setDoctor({...doctor, regNo: e.target.value})}
                   className="w-24 px-2 py-1 text-xs bg-transparent outline-none"
                 />
              </div>

           </div>
        </div>

        {/* Product Search Row (Modernized) */}
        <div className="bg-white dark:bg-[#1a1a24] border-b border-gray-200 dark:border-gray-800 p-2 flex items-center gap-2 shrink-0 relative z-20">
           <div className="relative flex-1">
             <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input
                ref={searchInputRef}
                type="text"
                placeholder="Search medicine by name or barcode to add to bill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
             />
             {searchTerm.length >= 2 && (
                <div className="absolute top-full left-0 mt-1 w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[300px] overflow-y-auto text-left z-50">
                  {isSearching ? (
                     <div className="p-4 text-center text-xs text-gray-500">Searching inventory...</div>
                  ) : searchResults.length > 0 ? (
                     searchResults.map((res: any) => (
                       <div key={res.id} className="p-2 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex justify-between items-center transition-colors" onClick={() => handleItemClick(res)}>
                         <div>
                           <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{res.name}</p>
                           <p className="text-[10px] text-gray-500">{res.generic_name || res.genericName || 'No Generic'}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(res.selling_price || res.mrp || 0)}</p>
                           {res.source === 'local' && (
                             <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded">Stock: {res.stock_quantity || 0}</span>
                           )}
                         </div>
                       </div>
                     ))
                  ) : (
                     <div className="p-4 text-center text-xs text-gray-500">No items found.</div>
                  )}
                </div>
             )}
           </div>
        </div>

        {/* Invoice Grid Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#12121a]">
          {/* Header */}
          <div className="flex bg-gray-200 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
             <div className="flex-[3] p-2 pl-4">Product Name</div>
             <div className="flex-1 p-2 text-center">Pack</div>
             <div className="flex-1 p-2 text-center">Batch</div>
             <div className="flex-1 p-2 text-center">Qty</div>
             <div className="flex-1 p-2 text-right">Rate</div>
             <div className="flex-1 p-2 text-right pr-4">Amount</div>
             <div className="w-8"></div>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {items.map((item) => (
               <div key={item.id} className="flex items-center text-xs border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800/20 transition-colors group">
                  <div className="flex-[3] p-2 pl-4 font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between gap-2">
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none w-full truncate shadow-sm transition-all"
                    />
                    <button 
                      onClick={() => setSelectedMedicineIdForInsights(item.medId)} 
                      className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded flex-shrink-0"
                      title="Medicine Intelligence"
                    >
                      <Activity className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 p-2 flex justify-center text-gray-500">
                    <input 
                      type="text" 
                      value={item.pack} 
                      onChange={(e) => updateItem(item.id, 'pack', e.target.value)}
                      className="w-16 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-center font-mono text-[10px] shadow-sm transition-all"
                    />
                  </div>
                  <div className="flex-1 p-2 flex justify-center text-gray-500">
                    <input 
                      type="text" 
                      value={item.batch} 
                      onChange={(e) => updateItem(item.id, 'batch', e.target.value)}
                      className="w-20 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-center font-mono text-[10px] shadow-sm transition-all"
                    />
                  </div>
                  <div className="flex-1 p-2 flex justify-center">
                    <input 
                      type="number" min="1" value={item.qty} 
                      onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                      className="w-14 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-1 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-center font-mono shadow-sm transition-all"
                    />
                  </div>
                  <div className="flex-1 p-2 flex justify-end text-gray-600 dark:text-gray-400">
                    <input 
                      type="number" step="0.01" min="0" 
                      value={item.rate} 
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-right font-mono shadow-sm transition-all"
                    />
                  </div>
                  <div className="flex-1 p-2 pr-4 flex justify-end text-gray-800 dark:text-gray-200">
                    <input 
                      type="number" step="0.01" min="0" 
                      value={item.amount} 
                      onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 px-2 py-1.5 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-right font-mono font-bold shadow-sm transition-all"
                    />
                  </div>
                  <div className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/30">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
               </div>
             ))}
             {items.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ScanLine className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Scan barcode or press F3 to search items.</p>
               </div>
             )}
          </div>
        </div>

        {/* Modern Footer Summary */}
        <div className="bg-white dark:bg-[#1a1a24] border-t border-gray-200 dark:border-gray-800 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
           <div className="flex items-center justify-between p-2 px-4 gap-4">
              <div className="flex gap-2 items-center">
                 <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">F3: Search</span>
                 <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">F9: Checkout</span>
                 <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">Esc: Close</span>
              </div>
              
              {/* Inline Totals */}
              <div className="flex items-center gap-6">
                 <div className="flex gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                   <div className="flex items-center gap-1"><span>Subtotal:</span> <span className="font-mono text-gray-800 dark:text-gray-200">{subtotal.toFixed(2)}</span></div>
                   <div className="flex items-center gap-1"><span>Discount:</span> <span className="font-mono text-emerald-500">0.00</span></div>
                   <div className="flex items-center gap-1"><span>GST:</span> <span className="font-mono text-gray-800 dark:text-gray-200">{(cgst + sgst).toFixed(2)}</span></div>
                 </div>
                 
                 <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Grand Total</span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight leading-none">{formatCurrency(grandTotal)}</span>
                    </div>
                    
                    <button 
                      onClick={() => setShowCheckout(true)}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20 group"
                    >
                      <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm tracking-wide">Checkout</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border flex flex-col p-6"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(grandTotal)}</span>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Mode</p>
                  <button onClick={() => setShowCheckout(false)} className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Cancel (Esc)</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'cash', icon: Banknote, label: 'Cash' },
                    { id: 'upi', icon: Smartphone, label: 'UPI' },
                    { id: 'card', icon: CreditCard, label: 'Card' },
                    { id: 'credit', icon: Wallet, label: 'Credit' }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 shadow-md' : 'border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'}`}
                    >
                      <method.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">{method.label}</span>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleFinalizeBill}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                >
                  <Printer className="w-5 h-5" />
                  Finalize & Print (F9)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>


      {/* List Modal for Drafts and Recent Bills */}
      <AnimatePresence>
        {(showDraftsModal || showRecentBillsModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border max-h-[80vh] flex flex-col"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {showDraftsModal ? 'Saved Drafts' : 'Recent Bills'}
                </h3>
                <button onClick={() => { setShowDraftsModal(false); setShowRecentBillsModal(false); }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {isLoadingBills ? (
                  <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : billsList.length === 0 ? (
                  <p className="text-center text-gray-500">No records found.</p>
                ) : (
                  <div className="grid gap-3">
                    {billsList.map((bill) => (
                      <div key={bill.id} className="p-4 border rounded-xl hover:border-emerald-500 cursor-pointer flex justify-between items-center transition-colors" style={{ borderColor: 'var(--border)' }} onClick={() => {
                        if (showDraftsModal) {
                          loadDraftIntoUI(bill);
                        } else {
                          // Handle viewing a recent bill if needed, or just loading it
                          loadDraftIntoUI(bill); // Let's just load it so they can reprint or view
                          setShowRecentBillsModal(false);
                        }
                      }}>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{bill.invoice_number}</p>
                          <p className="text-xs text-gray-500 mt-1">{bill.customer_name} • {new Date(bill.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">{formatCurrency(bill.total_amount)}</p>
                          <p className="text-xs text-gray-500 mt-1">{bill.items?.length || 0} items</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smart Add External Item Modal */}
      <AnimatePresence>
        {selectedExternal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800">
                    <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>External Catalog Item</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedExternal.name}</strong> is not present in your local inventory.
                    </p>
                    
                    <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border flex flex-col gap-1" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedExternal.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">MRP:</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(selectedExternal.mrp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/30 flex gap-3" style={{ borderColor: 'var(--border)' }}>
                <button 
                  onClick={() => setSelectedExternal(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 bg-white border hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel (Esc)
                </button>
                <button 
                  onClick={() => addExternalItemToBill(selectedExternal)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20"
                >
                  Bill Only (Enter)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Medicine Insights Drawer */}
      <AnimatePresence>
        {(selectedMedicineIdForInsights || showGlobalIntelligence) && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm print:hidden">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full md:w-[450px] lg:w-[500px] h-full bg-white dark:bg-[#1a1a24] shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white dark:bg-[#1a1a24] z-10" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Medicine Intelligence
                </h3>
                <button 
                  onClick={() => {
                    setSelectedMedicineIdForInsights(null)
                    setShowGlobalIntelligence(false)
                  }} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1">
                <MedicineInsightsPanel 
                  medicineId={selectedMedicineIdForInsights || (items.length > 0 ? items[items.length - 1].medId : '')} 
                  customerPhone={patient.phone ? patient.phone : undefined} 
                  onApplyRate={(rate, discount) => {
                    const targetMedId = selectedMedicineIdForInsights || (items.length > 0 ? items[items.length - 1].medId : '');
                    if (targetMedId) {
                      setItems(items.map(item => {
                        if (item.medId === targetMedId) {
                          const qty = Number(item.qty) || 1;
                          const baseTotal = qty * rate;
                          const discountAmount = (baseTotal * discount) / 100;
                          const discountedTotal = baseTotal - discountAmount;
                          
                          return { 
                            ...item, 
                            rate: Number(rate), 
                            discount: Number(discount),
                            amount: discountedTotal
                          };
                        }
                        return item;
                      }));
                      setShowGlobalIntelligence(false);
                      setSelectedMedicineIdForInsights(null);
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan}
        />
      )}

      {/* Scanner Toast Message Overlay */}
      <AnimatePresence>
        {scanMessage && showScanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[250]"
          >
            <div className={`px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 ${scanMessage.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {scanMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {scanMessage.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Prompt Alert Modal */}
      <AnimatePresence>
        {showPatientPromptModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-100 w-full max-w-sm rounded-lg shadow-2xl overflow-hidden border border-gray-300"
            >
              <div className="bg-gray-200 px-3 py-1 flex justify-between items-center border-b border-gray-300">
                <span className="text-xs text-gray-700">MARG ERP 9+ Alert !</span>
                <button onClick={() => setShowPatientPromptModal(false)} className="text-gray-500 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex items-start gap-4 bg-gray-100">
                <div className="text-amber-500 shrink-0">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10h2v5h-2M11 16h2v2h-2"/>
                  </svg>
                </div>
                <div className="text-[#1a2d3d] font-bold text-sm pt-2">
                  <p>New Patient Mob. !</p>
                  <p>Want to feed details ?</p>
                </div>
              </div>
              <div className="bg-gray-200 px-6 py-3 flex justify-center gap-6 border-t border-gray-300">
                <button 
                  onClick={() => {
                    setShowPatientPromptModal(false)
                    setShowAddPatientModal(true)
                  }}
                  className="bg-gray-100 border border-gray-400 px-8 py-1 rounded shadow-sm text-[#1a2d3d] font-bold hover:bg-gray-50 transition-colors"
                >
                  <span className="underline decoration-1 underline-offset-2">Y</span>es
                </button>
                <button 
                  onClick={() => setShowPatientPromptModal(false)}
                  className="bg-gray-100 border border-gray-400 px-8 py-1 rounded shadow-sm text-[#1a2d3d] font-bold hover:bg-gray-50 transition-colors outline outline-2 outline-blue-400 outline-offset-1"
                >
                  <span className="underline decoration-1 underline-offset-2">N</span>o
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Doctor Prompt Alert Modal */}
      <AnimatePresence>
        {showDoctorPromptModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-100 w-full max-w-sm rounded-lg shadow-2xl overflow-hidden border border-gray-300"
            >
              <div className="bg-gray-200 px-3 py-1 flex justify-between items-center border-b border-gray-300">
                <span className="text-xs text-gray-700">MARG ERP 9+ Alert !</span>
                <button onClick={() => setShowDoctorPromptModal(false)} className="text-gray-500 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex items-start gap-4 bg-gray-100">
                <div className="text-amber-500 shrink-0">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10h2v5h-2M11 16h2v2h-2"/>
                  </svg>
                </div>
                <div className="text-[#1a2d3d] font-bold text-sm pt-2">
                  <p>New Doctor Mob. !</p>
                  <p>Want to feed details ?</p>
                </div>
              </div>
              <div className="bg-gray-200 px-6 py-3 flex justify-center gap-6 border-t border-gray-300">
                <button 
                  onClick={() => {
                    setShowDoctorPromptModal(false)
                    setShowAddDoctorModal(true)
                  }}
                  className="bg-gray-100 border border-gray-400 px-8 py-1 rounded shadow-sm text-[#1a2d3d] font-bold hover:bg-gray-50 transition-colors"
                >
                  <span className="underline decoration-1 underline-offset-2">Y</span>es
                </button>
                <button 
                  onClick={() => setShowDoctorPromptModal(false)}
                  className="bg-gray-100 border border-gray-400 px-8 py-1 rounded shadow-sm text-[#1a2d3d] font-bold hover:bg-gray-50 transition-colors outline outline-2 outline-blue-400 outline-offset-1"
                >
                  <span className="underline decoration-1 underline-offset-2">N</span>o
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Patient Detail Form Modal */}
      <AnimatePresence>
        {showAddPatientModal && (
          <PatientDetailsModal
            phone={patient.phone}
            onClose={() => setShowAddPatientModal(false)}
            onSave={(data) => {
              setPatient(prev => ({ ...prev, ...data }))
              setIsPatientFound(true)
              setPatientDiscount(data.discount_percent || 0)
              setShowAddPatientModal(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Doctor Detail Form Modal */}
      <AnimatePresence>
        {showAddDoctorModal && (
          <DoctorDetailsModal
            phone={doctor.phone}
            onClose={() => setShowAddDoctorModal(false)}
            onSave={(data) => {
              setDoctor(prev => ({ ...prev, ...data }))
              setIsDoctorFound(true)
              setShowAddDoctorModal(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Hidden Print Component */}
      <div className="hidden print:block">
        <PrintInvoice 
          ref={printRef}
          invoiceNo={invoiceNo}
          date={date}
          patientName={patient.name}
          patientPhone={patient.phone}
          patientAge={patient.age}
          patientGender={patient.gender}
          doctorName={doctor.name}
          doctorRegNo={doctor.regNo}
          items={items}
          subtotal={subtotal}
          cgstAmount={cgst}
          sgstAmount={sgst}
          total={grandTotal}
        />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          @page { margin: 0.5cm; }
        }
      `}} />
    </>
  )
}
