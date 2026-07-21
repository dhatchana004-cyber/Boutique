import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { motion } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'

const STEPS = ['Information', 'Shipping', 'Payment']

const INDIAN_STATES = [
  'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra',
  'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal',
  'Telangana', 'Punjab', 'Haryana', 'Bihar', 'Odisha',
]

// ── Inline Toast ───────────────────────────────────────
function Toast({ message, type, onClose }) {
  const colors = {
    success: 'bg-green-500',
    error:   'bg-red-500/20',
    info:    'bg-[#D4AF37]',
  }
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4
      rounded-2xl text-white shadow-2xl text-sm font-semibold max-w-sm
      animate-slide-up ${colors[type] || colors.info}`}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

// ── Load Razorpay script once ──────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const location   = useLocation()
  const buyNowItem = location.state?.buyNowItem ?? null   // { productId, name, brand, price, image, quantity }
  const isBuyNow   = !!buyNowItem

  const [step, setStep]               = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState(null)
  const [toast, setToast]             = useState(null)

  const [info, setInfo] = useState({
    email:      user?.email || '',
    firstName:  user?.name?.split(' ')[0] || '',
    lastName:   user?.name?.split(' ')[1] || '',
    address:    '',
    apartment:  '',
    city:       '',
    state:      'Tamil Nadu',
    pincode:    '',
    phone:      user?.phone || '',
    newsletter: false,
  })

  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment]   = useState('razorpay')
  const [giftWrap, setGiftWrap] = useState(false)

  // ── Buy Now vs Cart totals ────────────────────────
  const displayItems = isBuyNow
    ? [buyNowItem]                  // single product from product page
    : cartItems                     // regular cart items

  const baseTotal    = isBuyNow
    ? buyNowItem.price * buyNowItem.quantity
    : cartTotal

  const shippingCost = baseTotal > 500 ? 0 : 50
  const giftWrapCost = giftWrap ? 500 : 0
  const tax          = Math.round(baseTotal * 0.05)
  const total        = baseTotal + shippingCost + giftWrapCost + tax

  const deliveryDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + (shipping === 'nextday' ? 1 : shipping === 'express' ? 3 : 7))
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }, [shipping])

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ── Razorpay Payment Handler ───────────────────────
  const handleRazorpay = async () => {
    if (!isLoggedIn) {
      showToast('Please log in to complete your purchase.', 'error')
      return navigate('/login')
    }

    setLoading(true)

    try {
      // 1. Load Razorpay JS SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        showToast('Failed to load payment gateway. Check your internet connection.', 'error')
        setLoading(false)
        return
      }

      // 2. Build items payload — Buy Now uses a single item, Cart uses all items
      const cartPayload = isBuyNow
        ? [{ productId: buyNowItem.productId, quantity: buyNowItem.quantity }]
        : cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity:  item.quantity,
          }))

      // 3. Create order on backend → get razorpayOrderId
      const orderRes = await orderService.createRazorpayOrder({
        cartItems:    cartPayload,
        shippingInfo: info,
        shippingCost,
        tax,
      })

      if (!orderRes.success) {
        showToast(orderRes.message || 'Failed to initiate payment.', 'error')
        setLoading(false)
        return
      }

      const { razorpayOrderId, amount, dbOrderId } = orderRes.data

      // 4. Open Razorpay modal
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SiWz05yxSDlA4e',
        amount,
        currency:    'INR',
        name:        'Luxe Precision',
        description: 'Premium Shopping Experience',
        image:       '/logo.png',
        order_id:    razorpayOrderId,
        prefill: {
          name:    `${info.firstName} ${info.lastName}`.trim(),
          email:   info.email,
          contact: info.phone,
          method:  'upi',
        },
        theme: { color: '#D4AF37' },

        // ── Success handler ──
        handler: async (response) => {
          try {
            const verifyRes = await orderService.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              dbOrderId,
            })

            if (verifyRes.success) {
              // Only clear cart for regular checkout — Buy Now leaves cart untouched
              if (!isBuyNow) await clearCart()
              setPlacedOrderId(dbOrderId)
              setOrderPlaced(true)
            } else {
              showToast('Payment verification failed. Please contact support.', 'error')
            }
          } catch (err) {
            console.error('Verify error:', err)
            showToast('Payment recorded but verification failed. We will resolve this shortly.', 'error')
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
            showToast('Payment cancelled. You can retry anytime.', 'info')
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response) => {
        setLoading(false)
        showToast(
          `Payment failed: ${response.error?.description || 'Something went wrong. Please try again.'}`,
          'error'
        )
      })

      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
      showToast(err?.response?.data?.message || 'Payment failed. Please try again.', 'error')
      setLoading(false)
    }
  }

  // ── COD Handler ───────────────────────────────────
  const handleCOD = async () => {
    if (!isLoggedIn) {
      showToast('Please log in to complete your purchase.', 'error')
      return navigate('/login')
    }
    
    setLoading(true)
    try {
      const cartPayload = isBuyNow
        ? [{ productId: buyNowItem.productId, quantity: buyNowItem.quantity }]
        : cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity:  item.quantity,
          }))

      const orderRes = await orderService.createCODOrder({
        cartItems:    cartPayload,
        shippingInfo: info,
        shippingCost,
        tax,
      })

      if (!orderRes.success) {
        showToast(orderRes.message || 'Failed to place order.', 'error')
        setLoading(false)
        return
      }

      if (!isBuyNow) await clearCart()   // only clear cart in normal checkout
      setPlacedOrderId(orderRes.data.dbOrderId)
      setOrderPlaced(true)
    } catch (err) {
      showToast(err?.response?.data?.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Order Success Screen ───────────────────────────
  if (orderPlaced) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center ring-8 ring-green-500/20">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-4xl font-black text-gray-100">Order Confirmed!</h1>
            <p className="text-gray-400 text-center max-w-sm leading-relaxed">
              Thank you for your purchase. Your order has been placed successfully.
              You'll receive a confirmation email shortly.
            </p>
            {placedOrderId && (
              <div className="bg-[#111111] rounded-2xl px-8 py-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-lg font-black text-gray-100">#{placedOrderId}</p>
              </div>
            )}
            <div className="bg-[#111111] rounded-2xl p-6 w-full max-w-sm text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order Total</p>
              <p className="text-3xl font-black text-[#D4AF37]">₹{total.toLocaleString()}.00</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-4">Arrives by {deliveryDate}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#D4AF37] text-black rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white transition-all">Back to Home</button>
              <button onClick={() => navigate('/account/orders')} className="px-8 py-3 border border-[#444444] text-gray-300 rounded-full font-bold text-sm tracking-widest uppercase hover:text-white hover:border-white transition-all">View Orders</button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#000000]">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left: Form ── */}
          <div>

            {/* Step 0: Information */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-100 mb-6">Contact Information</h2>

                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={info.email}
                    onChange={e => setInfo({ ...info, email: e.target.value })}
                    className="w-full border border-[#444444] rounded-xl px-4 py-3 text-sm
                      outline-none focus:border-[#D4AF37] transition-colors"
                  />

                  <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={info.newsletter}
                      onChange={e => setInfo({ ...info, newsletter: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    Email me with news and offers
                  </label>

                  <h2 className="text-xl font-black text-gray-100 mt-4 mb-2">Shipping Address</h2>

                  <select className="w-full border border-[#444444] rounded-xl px-4 py-3 text-sm
                    outline-none focus:border-[#D4AF37] bg-[#000000]">
                    <option>India</option>
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="First Name" value={info.firstName}
                      onChange={e => setInfo({ ...info, firstName: e.target.value })}
                      className="border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />
                    <input placeholder="Last Name" value={info.lastName}
                      onChange={e => setInfo({ ...info, lastName: e.target.value })}
                      className="border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />
                  </div>

                  <input placeholder="Address" value={info.address}
                    onChange={e => setInfo({ ...info, address: e.target.value })}
                    className="w-full border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />

                  <input placeholder="Apartment, suite, etc. (optional)" value={info.apartment}
                    onChange={e => setInfo({ ...info, apartment: e.target.value })}
                    className="w-full border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />

                  <div className="grid grid-cols-3 gap-4">
                    <input placeholder="City" value={info.city}
                      onChange={e => setInfo({ ...info, city: e.target.value })}
                      className="border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />
                    <select value={info.state}
                      onChange={e => setInfo({ ...info, state: e.target.value })}
                      className="border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] bg-[#000000]">
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input placeholder="PIN Code" value={info.pincode}
                      onChange={e => setInfo({ ...info, pincode: e.target.value })}
                      className="border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />
                  </div>

                  <input placeholder="Phone" value={info.phone}
                    onChange={e => setInfo({ ...info, phone: e.target.value })}
                    className="w-full border border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]" />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!info.email || !info.firstName || !info.address || !info.city || !info.pincode}
                  className="w-full mt-8 py-4 bg-[#D4AF37] text-white font-bold text-sm
                    tracking-widest uppercase rounded-full hover:bg-[#FFFFFF] hover:text-[#000000] transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-gray-100 mb-6">Shipping Method</h2>

                <div className="flex flex-col gap-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '5-7 business days', price: 'FREE' },
                    { id: 'express',  label: 'Express Delivery',  sub: '2-3 business days', price: '₹199' },
                    { id: 'nextday',  label: 'Next Day Delivery', sub: 'Order before 2PM',  price: '₹399' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl
                        cursor-pointer transition-all
                        ${shipping === opt.id
                          ? 'border-[#D4AF37] bg-[#111111]'
                          : 'border-[#444444] hover:border-gray-300'}`}
                      onClick={() => setShipping(opt.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${shipping === opt.id ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                          {shipping === opt.id && (
                            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-100">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.sub}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold
                        ${opt.price === 'FREE' ? 'text-green-600' : 'text-gray-100'}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-4 border border-[#444444] text-gray-400 font-bold
                      text-sm tracking-widest uppercase rounded-full hover:border-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-[#D4AF37] text-white font-bold text-sm
                      tracking-widest uppercase rounded-full hover:bg-[#FFFFFF] hover:text-[#000000] transition-all"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-gray-100 mb-6">Payment</h2>
                <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
                  🔒 All transactions are secure and encrypted
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Net Banking, Wallets', icon: '💳' },
                    { id: 'bnpl',     label: 'Buy Now, Pay Later', sub: 'Pay in 3 easy installments (via Razorpay)', icon: '🛍️' },
                    { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '💵' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl
                        cursor-pointer transition-all
                        ${payment === opt.id
                          ? 'border-[#D4AF37] bg-[#111111]'
                          : 'border-[#444444] hover:border-gray-300'}`}
                      onClick={() => setPayment(opt.id)}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${payment === opt.id ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                        {payment === opt.id && (
                          <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                      </div>
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-100">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Razorpay badge */}
                {payment === 'razorpay' && (
                  <div className="mb-6 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                    <p className="text-xs text-[#D4AF37] font-semibold flex items-center gap-2">
                      <span>⚡</span>
                      You'll be redirected to Razorpay's secure payment page.
                      Supports UPI, Credit/Debit Cards, Net Banking & Wallets.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-[#444444] text-gray-400 font-bold
                      text-sm tracking-widest uppercase rounded-full hover:border-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={payment === 'razorpay' || payment === 'bnpl' ? handleRazorpay : handleCOD}
                    disabled={loading}
                    className="flex-1 py-4 bg-[#D4AF37] text-white font-bold text-sm
                      tracking-widest uppercase rounded-full hover:bg-[#FFFFFF] hover:text-[#000000] transition-all
                      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : `Pay ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {/* Back to cart */}
            <button
              onClick={() => navigate('/cart')}
              className="mt-6 text-xs text-gray-400 hover:text-gray-400 transition-colors flex items-center gap-1"
            >
              ← Return to cart
            </button>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:border-l lg:border-[#333333] lg:pl-16">
            <p className="font-black text-gray-100 mb-6">Order Summary</p>

            {/* Items — Buy Now shows single product; Cart shows all items */}
            {isBuyNow && (
              <div className="mb-4 px-3 py-2 bg-[#111111] border border-[#333333] rounded-xl">
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  ⚡ Direct Purchase — Your cart is unaffected
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              {displayItems.map((item, idx) => {
                // Support both cart-item shape and buyNowItem shape
                const product = item.product || item
                const price   = product.price ?? item.price ?? 0
                const image   = product.image ?? item.image
                const name    = product.name  ?? item.name
                const brand   = product.brand ?? item.brand
                const key     = item.id ?? item.productId ?? idx

                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#111111]">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white
                        text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-100">{name}</p>
                      <p className="text-xs text-gray-400">{brand}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-100">
                      ₹{(price * item.quantity).toLocaleString()}.00
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#333333] pt-4 flex flex-col gap-3">
              <label className="flex items-center gap-3 p-3 bg-[#111111] border border-[#333333] rounded-xl cursor-pointer hover:border-[#444444] transition-colors mb-2">
                <input 
                  type="checkbox" 
                  checked={giftWrap} 
                  onChange={(e) => setGiftWrap(e.target.checked)} 
                  className="accent-[#D4AF37] w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-100">Luxury Gift Wrapping</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Include a handwritten note and bespoke velvet box (+₹500)</span>
                </div>
              </label>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-white">₹{baseTotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-500 font-bold' : 'font-semibold text-white'}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gift Wrap</span>
                  <span className="font-semibold text-white">₹500.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST (5%)</span>
                <span className="font-semibold text-white">₹{tax}.00</span>
              </div>
              <div className="border-t border-[#333333] pt-3 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-100">Total</span>
                  <span className="font-black text-[#D4AF37] text-xl">
                    ₹{total.toLocaleString()}.00
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-right mt-1">
                  Estimated Delivery: <span className="text-[#D4AF37] font-bold">{deliveryDate}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </PageTransition>
  )
}
