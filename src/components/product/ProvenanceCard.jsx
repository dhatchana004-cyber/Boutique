import QRCode from 'react-qr-code'
import { Leaf, Award, MapPin } from 'lucide-react'

export default function ProvenanceCard({ product }) {
  // Mock data for provenance
  const artisanName = product.category === 'sarees' ? 'Master Weaver Krishnan' : 'Artisan Workshop'
  const location = product.category === 'sarees' ? 'Kanchipuram, India' : 'Jaipur, India'
  const hours = product.category === 'sarees' ? '120 Hours' : '45 Hours'
  
  const qrData = `https://luxeprecision.com/provenance/${product.id}`

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        
        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="bg-white p-2 rounded-xl">
            <QRCode 
              value={qrData}
              size={100}
              level="H"
              fgColor="#111111"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-[9px] font-sans tracking-[0.2em] uppercase text-gray-500 text-center">
            Scan for Digital<br/>Certificate (NFT)
          </p>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-[#D4AF37]" />
            <h3 className="text-xl font-serif text-gray-100 tracking-wide">Product Provenance</h3>
          </div>
          
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Every thread tells a story. This authentic piece carries a verified digital certificate of origin, ensuring ethical sourcing and supreme craftsmanship.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">Artisan</span>
              <span className="text-sm text-gray-200">{artisanName}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">Origin</span>
              <span className="text-sm text-gray-200 flex items-center gap-1">
                <MapPin size={12} className="text-[#D4AF37]"/> {location}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">Time to Create</span>
              <span className="text-sm text-gray-200">{hours}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sustainability Banner */}
      <div className="mt-6 pt-4 border-t border-[#333333] flex items-center gap-3">
        <Leaf size={16} className="text-green-500" />
        <p className="text-xs text-gray-400 font-sans">
          This product is certified carbon-neutral. <span className="text-gray-200 underline cursor-pointer hover:text-white">Learn more</span>
        </p>
      </div>
    </div>
  )
}
