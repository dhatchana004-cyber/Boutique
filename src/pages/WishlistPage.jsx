import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Trash2, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '../utils/currency'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#000000]">

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-4xl mb-4">❤️</p>
            <p className="text-gray-100 font-bold text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm">Save your favorite items here</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 px-8 py-3 rounded-full bg-[#D4AF37] text-white text-xs font-bold tracking-widest uppercase hover:shadow-lg transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product
              return (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A] aspect-square mb-3" onClick={() => navigate(`/products/${product.id}`)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        removeFromWishlist(product.id);
                        toast.success('Removed from wishlist');
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#000000]/90
                        backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.2em] uppercase mb-1">
                    {product.brand} · {product.category}
                  </p>
                  <p className="text-gray-100 font-semibold text-sm mb-1 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-[#D4AF37] mb-4">
                      {formatCurrency(product.price)}
                    </p>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addToCart(product, 1);
                        toast.success('Added to cart');
                      }}
                      className="text-xs font-bold text-[#D4AF37] hover:underline uppercase flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
