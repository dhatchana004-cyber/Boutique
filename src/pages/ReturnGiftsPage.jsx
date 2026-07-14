import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Calendar, Phone, CheckCircle, ShoppingBag, Eye, X } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'

// --- Mock Data ---
const RETURN_GIFTS = [
  {
    id: 25,
    name: 'Meenakari Bowl Duo',
    desc: 'Exquisite handcrafted bowls in vibrant enamel work. A timeless classic.',
    price: 3450,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800',
  },
  {
    id: 24,
    name: 'Rani Velvet Jewel Box',
    desc: 'Plush velvet exterior with intricate Zari embroidery. Perfect for bespoke gifting.',
    price: 8900,
    image: '/assets/images/velvet_jewel_box.png',
  },
  {
    id: 31,
    name: 'Silver-Plated Thali Set',
    desc: 'A heavy, luxurious silver-plated serving set for festive milestones.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800',
  },
  {
    id: 32,
    name: 'Artisan Scented Candles',
    desc: 'Hand-poured soy candles infused with rare essential oils in a brass container.',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
  },
  {
    id: 28,
    name: 'Artisan Gift Hamper',
    desc: 'Premium imported nuts and dates presented in a handcrafted wooden chest.',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800',
  },
  {
    id: 33,
    name: 'Handwoven Silk Stoles',
    desc: 'Luxurious Banarasi silk stoles, an elegant token of appreciation for honored guests.',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800',
  },
  {
    id: 34,
    name: 'Floral Artisan Soap Set',
    desc: 'Handcrafted flower-shaped aroma soaps packaged in an elegant window gift box with ribbon.',
    price: 1250,
    image: '/assets/images/gift_1.jpg',
  },
  {
    id: 35,
    name: 'Blossom Paper Gift Bags',
    desc: 'Premium pastel pink gift bags decorated with silk ribbons and handcrafted vibrant floral accents.',
    price: 850,
    image: '/assets/images/gift_2.jpg',
  },
  {
    id: 36,
    name: 'Crimson Royal Luggage Set',
    desc: 'Exquisite white suitcases paired with traditional deep crimson wrapped chests, adorned with fresh orchids.',
    price: 18500,
    image: '/assets/images/gift_3.jpg',
  },
  {
    id: 37,
    name: 'Satin Rose Luggage Gift Set',
    desc: 'Luxury rose-gold suitcases paired with elegant white ribbon gift boxes, finished with gold floral accessories.',
    price: 15900,
    image: '/assets/images/gift_4.jpg',
  },
  {
    id: 38,
    name: 'MK Luxe Mother\'s Day Hamper',
    desc: 'A premium celebration hamper containing a designer Michael Kors handbag, fine French perfume, and matching card.',
    price: 24500,
    image: '/assets/images/gift_5.jpg',
  }
]

// --- Components ---

function Hero({ content }) {
  return (
    <section className="relative h-[70vh] flex flex-col justify-center items-center overflow-hidden bg-[#111111]">
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={content.imageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920'} 
          alt="Luxury Return Gifts" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-[#000000]/80" />
      </motion.div>

      <div className="relative z-10 text-center px-6 mt-20">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#D4AF37] text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase mb-6"
        >
          {content.heroTag}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#FFFFFF] leading-[1.1] mb-6 whitespace-pre-line"
        >
          {content.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-xs md:text-sm text-[#FFFFFF]/60 max-w-xl mx-auto leading-relaxed font-light mb-10 whitespace-pre-line"
        >
          {content.subtitle}
        </motion.p>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' })}
          className="px-10 py-4 bg-[#D4AF37] text-[#FFFFFF] text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase hover:bg-[#000000] transition-all duration-500 shadow-[0_0_20px_rgba(197,168,128,0.3)]"
        >
          Inquire Now
        </motion.button>
      </div>
    </section>
  )
}

function GiftCard({ gift }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [quickView, setQuickView] = useState(false)
  const [qty, setQty] = useState(1)

  const handleAddCart = (e) => {
    e?.stopPropagation()
    const productItem = {
      ...gift,
      brand: 'Vedhika & Co.',
      category: 'Return Gifts',
      price: Number(gift.price)
    }
    addToCart(productItem, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = (e) => {
    e?.stopPropagation()
    navigate('/checkout', {
      state: {
        buyNowItem: {
          productId: gift.id,
          name:      gift.name,
          brand:     'Vedhika & Co.',
          price:     Number(gift.price),
          image:     gift.image,
          quantity:  1,
        }
      }
    })
  }

  const handleModalAddCart = () => {
    const productItem = {
      ...gift,
      brand: 'Vedhika & Co.',
      category: 'Return Gifts',
      price: Number(gift.price)
    }
    addToCart(productItem, qty)
    setQuickView(false)
  }

  const handleModalBuyNow = () => {
    navigate('/checkout', {
      state: {
        buyNowItem: {
          productId: gift.id,
          name:      gift.name,
          brand:     'Vedhika & Co.',
          price:     Number(gift.price),
          image:     gift.image,
          quantity:  qty,
        }
      }
    })
  }

  return (
    <>
      <div 
        className="group relative bg-[#000000]/40 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-5 shadow-sm hover:shadow-[0_20px_50px_rgba(197,168,128,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
      >
        <div>
          {/* Image Container */}
          <div className="relative aspect-[4/5] bg-[#F5F2EB] overflow-hidden rounded-2xl mb-5 cursor-pointer" onClick={() => setQuickView(true)}>
            <img 
              src={gift.image} 
              alt={gift.name} 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            
            {/* Dark Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            
            {/* Quick Action Overlay Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <button 
                onClick={handleAddCart}
                className="w-9 h-9 rounded-full bg-[#000000] text-[#FFFFFF] hover:text-[#D4AF37] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Add to Cart"
              >
                <ShoppingBag size={15} />
              </button>
              <button 
                onClick={() => setQuickView(true)}
                className="w-9 h-9 rounded-full bg-[#000000] text-[#FFFFFF] hover:text-[#D4AF37] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Quick View"
              >
                <Eye size={15} />
              </button>
            </div>

            {/* Added Toast Badge */}
            {added && (
              <div className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm flex items-center justify-center z-20 transition-all">
                <div className="text-center text-white scale-100 transition-transform">
                  <CheckCircle size={28} className="text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-[10px] font-sans tracking-widest uppercase font-bold">Added to Cart</p>
                </div>
              </div>
            )}
          </div>

          {/* Info details */}
          <div className="px-1 text-left">
            <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Return Gift</span>
            <h3 className="font-serif text-lg text-[#FFFFFF] mt-1 mb-2 group-hover:text-[#D4AF37] transition-colors leading-tight">
              {gift.name}
            </h3>
            <p className="font-sans text-xs text-[#D4AF37] mb-4 leading-relaxed font-light line-clamp-2">
              {gift.desc}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-1 mb-4 border-t border-gray-50 pt-3">
            <span className="text-[10px] font-sans tracking-wider uppercase text-gray-400">Price</span>
            <span className="font-sans text-base font-bold text-[#D4AF37]">₹{gift.price.toLocaleString('en-IN')}</span>
          </div>

          {/* Actions Row */}
          <div className="flex gap-2.5">
            <button 
              onClick={handleAddCart}
              className="flex-1 py-3 border border-[#FFFFFF]/20 text-[#FFFFFF] hover:border-[#D4AF37] hover:text-[#D4AF37] text-[10px] font-sans font-bold tracking-widest uppercase rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-[#D4AF37] text-[#000000] hover:bg-[#111111] text-[10px] font-sans font-bold tracking-widest uppercase rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(92,29,36,0.15)] hover:shadow-none cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <AnimatePresence>
        {quickView && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
            onClick={() => setQuickView(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#000000] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative" 
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setQuickView(false)} 
                className="absolute top-4 right-4 z-10 p-1.5 bg-[#000000]/80 hover:bg-[#000000] rounded-full text-gray-400 hover:text-gray-650 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>

              {/* Left Image Pane */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#F5F2EB]">
                <img src={gift.image} className="w-full h-full object-cover" alt={gift.name} />
              </div>

              {/* Right Content Pane */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">✦ Luxury Return Gift</span>
                  <h3 className="text-2xl font-serif text-[#FFFFFF] tracking-wide">{gift.name}</h3>
                  <div className="h-[1px] bg-[#1A1A1A] w-full my-2" />
                  
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Price</p>
                  <p className="text-xl font-bold text-[#D4AF37]">₹{gift.price.toLocaleString('en-IN')}</p>
                  
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest pt-2">Description</p>
                  <p className="text-xs text-gray-650 leading-relaxed font-light">{gift.desc}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50 mt-6">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-gray-400">Quantity</span>
                    <div className="flex items-center border border-[#444444] rounded-full overflow-hidden">
                      <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="px-3.5 py-1.5 text-xs text-gray-500 hover:bg-[#111111] transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-bold text-gray-300">{qty}</span>
                      <button 
                        onClick={() => setQty(q => q + 1)}
                        className="px-3.5 py-1.5 text-xs text-gray-500 hover:bg-[#111111] transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={handleModalAddCart}
                      className="flex-1 py-3 border border-gray-250 text-[#FFFFFF] hover:bg-[#111111] text-[10px] font-sans font-bold tracking-widest uppercase rounded-2xl transition-all cursor-pointer text-center"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={handleModalBuyNow}
                      className="flex-1 py-3 bg-[#D4AF37] text-[#000000] hover:bg-[#D4AF37] text-[10px] font-sans font-bold tracking-widest uppercase rounded-2xl transition-all shadow-[0_4px_15px_rgba(92,29,36,0.15)] hover:shadow-none cursor-pointer text-center"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function GiftGallery({ content }) {
  return (
    <section className="py-20 md:py-32 px-6 bg-[#000000]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-serif text-[#FFFFFF] mb-4"
          >
            {content.galleryTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#D4AF37]"
          >
            {content.gallerySubtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {RETURN_GIFTS.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Process({ content }) {
  const steps = [
    { icon: Phone, title: content.step1Title, desc: content.step1Desc },
    { icon: Gift, title: content.step2Title, desc: content.step2Desc },
    { icon: Calendar, title: content.step3Title, desc: content.step3Desc },
  ]

  return (
    <section className="py-20 md:py-32 px-6 bg-[#111111] text-[#FFFFFF] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-serif mb-4">{content.processTitle}</h2>
          <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50">{content.processSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#111111] border border-[#D4AF37]/30 flex justify-center items-center mb-8 shadow-[0_0_30px_rgba(197,168,128,0.1)]">
                <step.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1} />
              </div>
              <h3 className="font-serif text-2xl mb-4">{step.title}</h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed font-light max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BulkInquiryForm({ content }) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="inquiry-form" className="py-20 md:py-32 px-6 bg-[#000000]">
      <div className="max-w-4xl mx-auto bg-[#000000] p-8 md:p-16 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#FFFFFF]/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-[#FFFFFF] mb-4">{content.inquiryTitle}</h2>
          <p className="font-sans text-sm text-[#D4AF37] font-light max-w-md mx-auto">{content.inquiryDesc}</p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <CheckCircle className="w-16 h-16 text-[#D4AF37] mb-6" strokeWidth={1} />
            <h3 className="text-2xl font-serif text-[#FFFFFF] mb-2">Inquiry Received</h3>
            <p className="text-[#D4AF37] font-sans text-sm">Thank you. Our concierge will be in touch shortly.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-[#FFFFFF] mb-2">Full Name</label>
                <input required type="text" className="w-full bg-transparent border-b border-[#FFFFFF]/20 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors font-serif" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-[#FFFFFF] mb-2">Email Address</label>
                <input required type="email" className="w-full bg-transparent border-b border-[#FFFFFF]/20 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors font-serif" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-[#FFFFFF] mb-2">Event Type</label>
                <select required defaultValue="" className="w-full bg-transparent border-b border-[#FFFFFF]/20 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors font-serif appearance-none">
                  <option value="" disabled>Select Occasion</option>
                  <option value="wedding">Wedding / Pre-Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="festive">Festive Gifting</option>
                  <option value="other">Other Milestone</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-[#FFFFFF] mb-2">Estimated Quantity</label>
                <select required defaultValue="" className="w-full bg-transparent border-b border-[#FFFFFF]/20 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors font-serif appearance-none">
                  <option value="" disabled>Select Volume</option>
                  <option value="25-50">25 - 50 Gifts</option>
                  <option value="50-100">50 - 100 Gifts</option>
                  <option value="100-500">100 - 500 Gifts</option>
                  <option value="500+">500+ Gifts</option>
                </select>
              </div>
            </div>
            <div className="pt-4">
              <label className="block text-[10px] font-sans uppercase tracking-widest text-[#FFFFFF] mb-2">Additional Details</label>
              <textarea rows="3" className="w-full bg-transparent border-b border-[#FFFFFF]/20 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors font-serif resize-none" placeholder="Any specific themes, colors, or budget constraints..."></textarea>
            </div>
            <div className="pt-8 text-center">
              <button type="submit" className="px-12 py-4 bg-[#111111] text-[#FFFFFF] text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-colors duration-500">
                Submit Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default function ReturnGiftsPage() {
  const { content } = useSiteContent('return-gifts', {
    heroTag: 'Bulk & Corporate Gifting', title: 'Curated Elegance For Every Guest', subtitle: 'Elevate your milestones—weddings, corporate retreats, and grand celebrations—with bespoke return gifts crafted by master artisans.', imageUrl: '',
    galleryTitle: 'The Gift Gallery', gallerySubtitle: 'A Selection of our most coveted pieces',
    processTitle: 'The Experience', processSubtitle: 'Seamless from concept to unboxing',
    step1Title: 'Consultation', step1Desc: 'Discuss your event theme, guest list, and vision with our dedicated gifting concierge.',
    step2Title: 'Customization', step2Desc: 'Select products, bespoke packaging, ribbons, and personalized name tags or logos.',
    step3Title: 'Delivery', step3Desc: 'Relax as we handle the logistics, ensuring pristine, on-time delivery to your venue.',
    inquiryTitle: 'Request a Quote', inquiryDesc: 'Fill out the details below, and our gifting concierge will contact you within 24 hours.'
  })

  return (
    <main className="bg-[#000000] min-h-screen">
      <Hero content={content} />
      <GiftGallery content={content} />
      <Process content={content} />
      <BulkInquiryForm content={content} />
    </main>
  )
}
