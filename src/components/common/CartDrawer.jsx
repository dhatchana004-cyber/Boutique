import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'

export default function CartDrawer() {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setIsCartDrawerOpen(false)
  }

  const handleCheckout = () => {
    setIsCartDrawerOpen(false)
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-[#1A1A1A] border-l border-[#333333] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#333333]">
              <h2 className="text-xl font-serif text-[#FDFBF7]">Your Bag</h2>
              <button 
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#333333]/50 flex items-center justify-center text-gray-400">
                    <Trash2 size={24} />
                  </div>
                  <p className="font-serif text-[#FDFBF7] text-lg">Your bag is empty</p>
                  <button 
                    onClick={() => { setIsCartDrawerOpen(false); navigate('/products') }}
                    className="text-[#C5A880] text-[10px] font-sans font-bold tracking-widest uppercase hover:text-[#FDFBF7] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <img 
                      src={item.product?.image || item.image} 
                      alt={item.product?.name || item.name} 
                      className="w-20 h-24 object-cover rounded-md bg-[#222222]" 
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[#C5A880] text-[9px] font-bold tracking-[0.2em] uppercase mb-1">
                            {item.product?.brand || item.brand}
                          </p>
                          <h3 className="font-serif text-[#FDFBF7] text-sm leading-tight max-w-[180px]">
                            {item.product?.name || item.name}
                          </h3>
                          {item.size && (
                            <p className="text-gray-400 text-xs mt-1">Size: {item.size}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-full px-3 py-1 border border-[#333333]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white">
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white">
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-sans text-white text-sm font-bold">
                          {formatCurrency((item.product?.price || item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#333333] bg-[#1A1A1A]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-sans text-sm">Subtotal</span>
                  <span className="text-xl font-bold font-serif text-[#C5A880]">{formatCurrency(cartTotal)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#C5A880] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#FDFBF7] transition-colors flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => { setIsCartDrawerOpen(false); navigate('/cart') }}
                    className="w-full py-3 mt-3 text-[#FDFBF7] text-[10px] font-bold uppercase tracking-widest border border-[#333333] rounded-full hover:bg-[#333333] transition-colors text-center"
                  >
                    View Bag
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
