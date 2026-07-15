import { useState, useRef, useEffect } from 'react'
import { X, Upload, Camera, Search, Aperture } from 'lucide-react'

export default function VisualSearchModal({ isOpen, onClose }) {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [extractedKeyword, setExtractedKeyword] = useState('')
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const videoRef = useRef(null)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      setIsCameraOpen(false)
      setIsScanning(false)
      setResult(null)
    }
    return () => stopCamera()
  }, [isOpen])

  const startCamera = async () => {
    setIsCameraOpen(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setHasPermission(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setHasPermission(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  if (!isOpen) return null

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      simulateScan(file)
    }
  }
  
  const handleCapture = () => {
    stopCamera()
    setIsCameraOpen(false)
    simulateScan(null)
  }

  const simulateScan = (file) => {
    setIsScanning(true)
    setResult(null)
    
    const mocks = ['Kundan', 'Silk Saree', 'Lehenga', 'Perfume', 'Silver Thali', 'Jewel Box']
    let keyword = mocks[Math.floor(Math.random() * mocks.length)] // Default fallback
    
    if (file) {
      // Clean up the filename (e.g., "red-silk-saree(1).jpg" -> "red silk saree")
      let name = file.name.split('.')[0]
        .replace(/[-_()]/g, ' ')
        .replace(/[0-9]/g, '')
        .trim()
        .toLowerCase()
        
      // Check if it's a generic auto-generated filename
      const genericNames = ['image', 'images', 'download', 'photo', 'img', 'untitled', 'picture', 'pic']
      
      // Use filename if it's meaningful
      if (name.length > 2 && !genericNames.includes(name)) {
        keyword = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
    
    setExtractedKeyword(keyword)
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsScanning(false)
      setResult(`Image analyzed successfully. Found matches for "${keyword}".`)
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-[#FDFBF7]/10 w-full max-w-md p-6 relative rounded-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#FDFBF7]/60 hover:text-[#FDFBF7] transition-colors" aria-label="Close">
          <X size={20} />
        </button>

        <h2 className="font-serif text-xl text-[#FDFBF7] mb-2 text-center tracking-wide">Visual Search</h2>
        <p className="text-[#FDFBF7]/60 text-xs font-sans text-center mb-8 tracking-wider uppercase">Upload or capture an image</p>

        {!isScanning && !result && !isCameraOpen && (
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleUploadClick}
              className="flex items-center justify-center gap-3 w-full py-4 border border-[#FDFBF7]/20 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors text-[#FDFBF7] font-sans text-sm tracking-widest uppercase rounded-sm group"
            >
              <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
              Upload Image
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div className="flex items-center justify-center gap-4 my-2">
              <div className="h-px bg-[#FDFBF7]/10 flex-1"></div>
              <span className="text-[#FDFBF7]/40 text-[10px] font-sans tracking-widest uppercase">OR</span>
              <div className="h-px bg-[#FDFBF7]/10 flex-1"></div>
            </div>

            <button 
              onClick={startCamera}
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#FDFBF7]/5 hover:bg-[#FDFBF7]/10 border border-transparent transition-colors text-[#FDFBF7] font-sans text-sm tracking-widest uppercase rounded-sm group"
            >
              <Camera size={18} className="group-hover:scale-110 transition-transform" />
              Use Camera
            </button>
          </div>
        )}

        {isCameraOpen && (
          <div className="flex flex-col items-center">
             {hasPermission === false ? (
                <div className="text-center py-10">
                  <Camera size={32} className="text-[#FDFBF7]/40 mx-auto mb-4" />
                  <p className="text-[#FDFBF7] text-sm">Camera access is required.</p>
                  <button onClick={() => setIsCameraOpen(false)} className="mt-4 text-[#C5A880] text-xs uppercase tracking-widest hover:text-[#FDFBF7]">Go Back</button>
                </div>
             ) : (
                <div className="w-full relative bg-black aspect-[3/4] rounded-sm overflow-hidden border border-[#FDFBF7]/10">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                  {stream && (
                    <button 
                      onClick={handleCapture}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#FDFBF7]/20 border-4 border-[#FDFBF7] flex items-center justify-center hover:bg-[#FDFBF7]/40 transition-colors z-10"
                    >
                      <Aperture size={24} className="text-[#FDFBF7]" />
                    </button>
                  )}
                </div>
             )}
          </div>
        )}

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-2 border-[#C5A880] rounded-sm animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search size={32} className="text-[#C5A880] animate-pulse" />
              </div>
            </div>
            <p className="text-[#C5A880] text-xs font-sans tracking-[0.2em] uppercase animate-pulse">Scanning Image...</p>
          </div>
        )}

        {result && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#C5A880]/10 flex items-center justify-center mb-4">
              <Search size={24} className="text-[#C5A880]" />
            </div>
            <p className="text-[#FDFBF7] text-sm font-sans mb-6 text-center">{result}</p>
            <button 
              onClick={() => {
                onClose()
                window.location.href = `/products?search=${encodeURIComponent(extractedKeyword)}`
              }}
              className="px-8 py-3 bg-[#C5A880] text-[#1A1A1A] font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#FDFBF7] transition-colors rounded-sm"
            >
              View Results
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
