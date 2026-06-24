import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera, RefreshCw } from 'lucide-react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string>('')
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([])
  const [activeCamera, setActiveCamera] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  // Avoid scanning the same code multiple times within a short window
  const lastScannedTime = useRef<number>(0)
  const lastScannedCode = useRef<string>('')

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader")

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices)
        setActiveCamera(devices[0].id)
      } else {
        setError('No cameras found on this device.')
      }
    }).catch(err => {
      setError('Camera permission denied or unavailable.')
      console.error(err)
    })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [])

  useEffect(() => {
    if (activeCamera && scannerRef.current && !isScanning) {
      startScanner()
    }
  }, [activeCamera])

  const startScanner = async () => {
    if (!scannerRef.current || !activeCamera) return
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop()
      }
      await scannerRef.current.start(
        activeCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          const now = Date.now()
          // Prevent duplicate scans within 2 seconds
          if (decodedText !== lastScannedCode.current || now - lastScannedTime.current > 2000) {
            lastScannedCode.current = decodedText
            lastScannedTime.current = now
            onScan(decodedText)
          }
        },
        (errorMessage) => {
          // Ignore frequent "not found" errors from continuous scanning
        }
      )
      setIsScanning(true)
    } catch (err) {
      console.error("Scanner error", err)
      setError('Failed to start camera stream.')
    }
  }

  const switchCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.id === activeCamera)
      const nextIndex = (currentIndex + 1) % cameras.length
      setActiveCamera(cameras[nextIndex].id)
      setIsScanning(false) // Will restart in useEffect
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white border-b border-gray-800 bg-black/50">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="font-bold text-lg leading-tight">Continuous Scan Mode</h2>
            <p className="text-xs text-gray-400">Scan barcodes sequentially</p>
          </div>
        </div>
        <div className="flex gap-4">
          {cameras.length > 1 && (
            <button 
              onClick={switchCamera}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              title="Switch Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            title="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scanner Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center max-w-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 ring-4 ring-gray-800 bg-gray-900">
            <div id="reader" className="w-full h-full object-cover"></div>
            
            {/* Visual Reticle Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full border-2 border-emerald-500/50 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-0.5 -mr-0.5"></div>
                {/* Scanning Laser Animation */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-gray-400 text-sm mt-8 font-medium bg-gray-900 px-6 py-3 rounded-full border border-gray-800">
          Point camera at a barcode to add to bill
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        /* Hide html5-qrcode default UI elements */
        #reader__dashboard_section_csr { display: none !important; }
        #reader__dashboard_section_swaplink { display: none !important; }
        #reader__header_message { display: none !important; }
      `}} />
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
