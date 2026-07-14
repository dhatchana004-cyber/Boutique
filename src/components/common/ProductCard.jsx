import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'
import QuickViewModal from './QuickViewModal'
import toast from 'react-hot-toast'

export default function ProductCard({ product, variants }) {
  const navigate = useNavigate()
  const { toggleWishlist, isWished } = useWishlist()
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const wished = isWished(product.id)

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
    toast.success('Added to Cart')
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  // Determine badges dynamically
  const getBadges = () => {
    const badges = []
    if (product.category?.toLowerCase() === 'sarees') {
      badges.push({ text: 'BEST SELLER', type: 'dark' })
      badges.push({ text: 'HANDMADE', type: 'dark' })
    } else if (product.category?.toLowerCase() === 'jewellery') {
      badges.push({ text: 'TRENDING', type: 'accent' })
    } else if (product.isNew) {
      badges.push({ text: 'NEW ARRIVAL', type: 'accent' })
    }
    
    // Add default badge if none
    if (badges.length === 0 && product.price > 10000) {
      badges.push({ text: 'HERITAGE', type: 'accent' })
    }
    return badges
  }

  const badges = getBadges()

  // Hover Swap Image logic (fall back to main image if no images array or only 1 image)
  const displayImage = isHovered && product.images && product.images.length > 1 
    ? product.images[1] 
    : product.image;

  const CardWrapper = variants ? motion.div : 'div';

  return (
    <>
      <CardWrapper 
        variants={variants}
        className="group cursor-pointer flex flex-col"
        onClick={() => navigate(`/products/${product.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container with rounded corners and overlay buttons */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <img
            src={displayImage || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800'}
            alt={product.name}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800' }}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />

          {/* Dynamic Badges (Top Left) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {badges.map((b, i) => (
              <span 
                key={i} 
                className={`text-[9px] font-sans font-bold tracking-widest px-3 py-1.5 rounded-sm uppercase
                  ${b.type === 'dark' ? 'bg-[#111111] text-white border border-[#333333]' : 'bg-[#D4AF37] text-[#000000]'}`}
              >
                {b.text}
              </span>
            ))}
          </div>

          {/* Overlay Actions (Centered & Hover Revealed) */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
            <button 
              onClick={handleAddToCart}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors shadow-xl"
              title="Add to Cart"
            >
              <ShoppingBag size={18} />
            </button>
            <button 
              onClick={handleQuickView}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors shadow-xl"
              title="Quick View"
            >
              <Eye size={18} />
            </button>
          </div>

          {/* Wishlist Button Overlay (Top Right) */}
          <button 
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 border border-[#333333]"
          >
            <Heart 
              size={15} 
              fill={wished ? '#D4AF37' : 'none'} 
              color={wished ? '#D4AF37' : '#FFFFFF'} 
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Info details */}
        <div className="flex flex-col px-1 text-center md:text-left">
          {/* Star Ratings Placeholder */}
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2 text-[#D4AF37]">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i} className="text-[10px]">{star}</span>
            ))}
            <span className="text-[10px] text-gray-500 ml-1">(124)</span>
          </div>

          <h3 className="font-serif text-lg text-[#FFFFFF] mb-1.5 group-hover:text-[#D4AF37] transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 hidden md:block">
            {product.brand} · {product.category}
          </p>
          <p className="font-sans text-sm font-bold text-white">
            {formatCurrency(product.price)}
          </p>
        </div>
      </CardWrapper>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={quickViewOpen} 
        onClose={() => setQuickViewOpen(false)} 
      />
    </>
  )
}
