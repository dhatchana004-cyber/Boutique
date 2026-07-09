import { useState, useEffect } from 'react'
import { Check, Plus, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'
import toast from 'react-hot-toast'

export default function OutfitBuilder({ mainProduct, relatedProducts }) {
  const { addToCart } = useCart()
  
  // State for which items are selected to be added to the bundle
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    // By default, maybe select the first accessory? Or none.
    setSelectedItems([])
  }, [mainProduct])

  if (!relatedProducts || relatedProducts.length === 0) return null

  const toggleItem = (product) => {
    if (selectedItems.find(p => p.id === product.id)) {
      setSelectedItems(selectedItems.filter(p => p.id !== product.id))
    } else {
      setSelectedItems([...selectedItems, product])
    }
  }

  const handleAddBundle = () => {
    // Add main product
    addToCart(mainProduct, 1)
    // Add selected accessories
    selectedItems.forEach(item => {
      addToCart(item, 1)
    })
    toast.success(`Added ${selectedItems.length + 1} items to your cart!`)
    setSelectedItems([]) // reset
  }

  const bundleTotal = mainProduct.price + selectedItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="bg-[#111111] py-16 mt-16 border-t border-[#FDFBF7]/10 relative overflow-hidden">
      {/* Background glow for AI vibe */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[10px] text-[#C5A880] font-sans tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
              <Sparkles size={12} /> AI Stylist Suggestion
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#FDFBF7]">Complete The Look</h2>
            <p className="text-sm text-[#FDFBF7]/60 font-sans mt-3 max-w-xl font-light">
              Our AI has curated these perfect matches for your {mainProduct.name}. Select pieces to build your ultimate outfit.
            </p>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4">
              <p className="text-xs text-[#FDFBF7]/60 uppercase tracking-widest mb-1">Bundle Total</p>
              <p className="text-2xl font-bold text-[#C5A880] mb-3">{formatCurrency(bundleTotal)}</p>
              <button 
                onClick={handleAddBundle}
                className="flex items-center gap-2 px-6 py-3 bg-[#C5A880] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-colors rounded-sm"
              >
                <ShoppingBag size={14} /> Add Bundle To Cart
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Product Card (Fixed) */}
          <div className="relative border border-[#C5A880] bg-[#1A1A1A] p-4 rounded-sm flex flex-col opacity-80 grayscale-[20%]">
            <div className="absolute top-2 right-2 bg-[#C5A880] text-[#1A1A1A] text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm z-10">
              Main Item
            </div>
            <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4 bg-[#111111]">
              <img src={mainProduct.image} alt={mainProduct.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] text-[#C5A880] font-bold tracking-widest uppercase mb-1">{mainProduct.brand}</p>
            <h3 className="font-serif text-[#FDFBF7] text-lg mb-2 flex-1">{mainProduct.name}</h3>
            <p className="text-[#FDFBF7]/80 font-bold">{formatCurrency(mainProduct.price)}</p>
          </div>

          {/* Plus Sign (Desktop only) */}
          <div className="hidden md:flex items-center justify-center -mx-3 z-10">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#FDFBF7]/20 flex items-center justify-center text-[#FDFBF7]/50">
              <Plus size={16} />
            </div>
          </div>

          {/* Accessories / Matching Items */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((product) => {
              const isSelected = selectedItems.find(p => p.id === product.id)
              return (
                <div 
                  key={product.id} 
                  onClick={() => toggleItem(product)}
                  className={`relative p-4 rounded-sm flex flex-col cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? 'border-[#C5A880] bg-[#C5A880]/5 shadow-[0_0_20px_rgba(197,168,128,0.1)]' 
                      : 'border-[#FDFBF7]/10 bg-[#1A1A1A] hover:border-[#FDFBF7]/30'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-colors ${
                    isSelected ? 'border-[#C5A880] bg-[#C5A880]' : 'border-[#FDFBF7]/30 bg-black/50 backdrop-blur-sm'
                  }`}>
                    {isSelected && <Check size={14} className="text-[#1A1A1A]" />}
                  </div>

                  <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4 bg-[#111111]">
                    <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'grayscale-[20%]'}`} />
                  </div>
                  <p className="text-[10px] text-[#C5A880] font-bold tracking-widest uppercase mb-1">{product.category}</p>
                  <h3 className="font-serif text-[#FDFBF7] text-lg mb-2 flex-1">{product.name}</h3>
                  <p className="text-[#FDFBF7]/80 font-bold">{formatCurrency(product.price)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
