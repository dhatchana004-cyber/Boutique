import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency } from '../../utils/currency'
import toast from 'react-hot-toast'

export default function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWished } = useWishlist()

  if (!product) return null

  const wished = isWished(product.id)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleAddToCart = () => {
    addToCart(product, 1)
    toast.success('Added to Cart')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-[#111111] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-[#333333] shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#000000] relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] mb-2">
                {product.brand} · {product.category}
              </p>
              
              <h2 className="text-3xl font-serif text-white mb-2 leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#D4AF37]">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-sm">{star}</span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-sans">(124 Reviews)</span>
              </div>

              <p className="text-2xl font-black text-[#D4AF37] mb-6">
                {formatCurrency(product.price)}
              </p>
              
              <p className="text-sm text-gray-400 leading-relaxed mb-8 line-clamp-3">
                {product.description || "Experience bespoke luxury craftsmanship and exquisite silhouettes hand-embroidered for your most memorable moments."}
              </p>

              <div className="flex flex-col gap-4 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors
                      ${wished ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Heart size={14} fill={wished ? '#D4AF37' : 'none'} /> 
                    {wished ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                  
                  <button 
                    onClick={() => {
                      onClose()
                      navigate(`/products/${product.id}`)
                    }}
                    className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
                  >
                    Full Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
