import { useState, useRef, useEffect } from 'react'
import { X, Camera, RefreshCw } from 'lucide-react'

export default function VirtualTryOn({ isOpen, onClose, productImg }) {
  const [stream, setStream] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen])

  const startCamera = async () => {
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

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      // Mirror the context to match the CSS scale-x-[-1] applied to video
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const dataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(dataUrl)
      stopCamera()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-[#0a0a0a] border border-[#FFFFFF]/10 relative rounded-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#FFFFFF]/10 bg-[#111111]">
          <h2 className="font-serif text-lg text-[#FFFFFF] tracking-wide flex items-center gap-2">
            <Camera size={18} className="text-[#D4AF37]" /> Virtual Try-On
          </h2>
          <button onClick={onClose} className="text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors p-1 bg-[#FFFFFF]/5 rounded-full" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {hasPermission === false ? (
            <div className="text-center p-8">
              <Camera size={48} className="text-[#FFFFFF]/20 mx-auto mb-4" />
              <p className="text-[#FFFFFF] font-sans text-sm mb-4">Camera access is required for Virtual Try-On.</p>
              <button 
                onClick={startCamera}
                className="px-6 py-2 bg-[#D4AF37] text-black font-sans text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-white transition-colors"
              >
                Allow Camera
              </button>
            </div>
          ) : (
            <>
              {/* Video Stream or Captured Image */}
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              )}
              
              {/* Overlay AR Elements */}
              {(stream || capturedImage) && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Face detection grid mockup */}
                  <div className="absolute top-[20%] w-64 h-80 border border-[#D4AF37]/50 rounded-[40%] flex items-center justify-center animate-pulse">
                    <div className="absolute top-0 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                    <div className="absolute bottom-0 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                    <div className="absolute left-0 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                    <div className="absolute right-0 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  </div>
                  
                  {/* Product Overlay Mockup */}
                  <div className="absolute top-[55%] flex flex-col items-center">
                    <img src={productImg} alt="Try on" className="w-64 object-contain opacity-80 mix-blend-screen drop-shadow-2xl" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-[#111111] border-t border-[#FFFFFF]/10 flex justify-center gap-4">
          {capturedImage ? (
            <>
              <button onClick={retakePhoto} className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF]/10 text-[#FFFFFF] hover:bg-[#FFFFFF]/20 font-sans text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm transition-colors">
                <RefreshCw size={14} /> Retake
              </button>
              <a href={capturedImage} download="luxe-tryon.jpg" className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black hover:bg-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm transition-colors">
                <Camera size={14} /> Save Photo
              </a>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF]/10 text-[#FFFFFF] hover:bg-[#FFFFFF]/20 font-sans text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm transition-colors">
                <RefreshCw size={14} /> Switch Camera
              </button>
              <button onClick={takePhoto} className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black hover:bg-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm transition-colors">
                <Camera size={14} /> Take Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
