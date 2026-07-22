import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'
import { formatCurrency } from '../utils/currency'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import ProductCard from '../components/common/ProductCard'
import toast from 'react-hot-toast'
import { X, Ruler, Eye, Box, Camera } from 'lucide-react'
import Product3DViewer from '../components/product/Product3DViewer'
import VirtualTryOn from '../components/product/VirtualTryOn'
import ProvenanceCard from '../components/product/ProvenanceCard'
import { useRealTimeSim } from '../hooks/useRealTimeSim'
import OutfitBuilder from '../components/product/OutfitBuilder'

export default function ProductDetailPage() {
  const { addToCart } = useCart()
  const { id } = useParams()

  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [activeImg, setActiveImg] = useState(0)
  const [quantity, setQuantity]   = useState(1)
  const [related, setRelated]     = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { viewers, left, recentPurchases } = useRealTimeSim(12, 3)
  const [viewMode, setViewMode] = useState('2d')
  const [showTryOn, setShowTryOn] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')

  // Magnifier state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, show: false })

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await productService.getProductById(id)
        if (response.success && response.data) {
          setProduct(response.data)
          // Fetch cross-category related products for Outfit Builder
          const allProductsResponse = await productService.getAllProducts({})
          if (allProductsResponse.success) {
            const otherItems = allProductsResponse.data.filter(p => p.category !== response.data.category && p.id !== response.data.id)
            setRelated(otherItems.length >= 3 ? otherItems.slice(0, 3) : allProductsResponse.data.filter(p => p.id !== response.data.id).slice(0, 3))
          }

          // Handle Recently Viewed
          const viewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]')
          setRecentlyViewed(viewed.filter(p => p.id !== response.data.id).slice(0, 4))
          
          const newViewed = [response.data, ...viewed.filter(p => p.id !== response.data.id)].slice(0, 10)
          localStorage.setItem('luxe_recently_viewed', JSON.stringify(newViewed))
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Error fetching product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    const productWithSize = { ...product, size: selectedSize }
    addToCart(productWithSize, quantity)
    toast.success(`${product.name} added to cart`)
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.pageX - left) / width) * 100
    const y = ((e.pageY - top) / height) * 100
    setMousePos({ x, y, show: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] px-6 py-8 animate-pulse flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="aspect-square bg-[#111111] rounded-2xl border border-[#333333]"></div>
          <div className="flex flex-col gap-6">
            <div className="w-1/3 h-4 bg-[#333333] rounded"></div>
            <div className="w-2/3 h-10 bg-[#222222] rounded"></div>
            <div className="w-1/4 h-8 bg-[#D4AF37]/30 rounded"></div>
            <div className="w-full h-24 bg-[#111111] rounded mt-4"></div>
            <div className="w-full h-12 bg-[#D4AF37]/20 rounded-full mt-10"></div>
          </div>
        </div>
      </div>
    )
  }

  // Product not found
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#000000]">
        <p className="text-5xl">😕</p>
        <p className="text-xl font-bold text-gray-100">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-full text-sm font-bold">
          Back to Products
        </button>
      </div>
    )
  }

  const currentImage = product.images && product.images.length > 0 ? product.images[activeImg] : product.image;

  return (
    <PageTransition>
      <SEO title={product.name} description={product.description} image={currentImage} />
      <div className="min-h-screen bg-[#000000]">

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#D4AF37] transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`}
              className="hover:text-[#D4AF37] transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-400">{product.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* ── Left: Image Gallery ── */}
            <div className="flex flex-col gap-4">

              {/* Main Image with Zoom effect */}
                <div 
                  className="relative overflow-hidden rounded-2xl bg-[#111111] aspect-square cursor-crosshair group"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ ...mousePos, show: false })}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${mousePos.show ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* Zoom layer */}
                <div 
                  className={`absolute inset-0 bg-no-repeat transition-opacity duration-300 ${mousePos.show ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: '200%' // Zoom level
                  }}
                />

                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-[#D4AF37] text-white
                    text-xs font-bold px-3 py-1 rounded-full tracking-wider z-10">
                    NEW
                  </span>
                )}
              </div>


              {/* Thumbnail Strip */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all
                        ${activeImg === i
                          ? 'border-[#D4AF37] shadow-lg shadow-yellow-900/20'
                          : 'border-transparent hover:border-[#444444]'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col">

              {/* Brand + Category */}
              <p className="text-xs text-[#D4AF37] font-bold tracking-[0.25em] uppercase mb-3">
                {product.brand} · {product.category}
              </p>

              {/* Name */}
              <h1 className="text-4xl font-black text-gray-100 leading-tight mb-4 font-serif">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#D4AF37]">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-sm">{star}</span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-sans cursor-pointer hover:text-white transition-colors underline underline-offset-4">(124 Verified Reviews)</span>
              </div>

              {/* Price */}
              <div className="flex flex-col mb-4">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-[#D4AF37]">
                    {formatCurrency(product.price)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-xl text-gray-500 line-through decoration-gray-500/50">
                      {formatCurrency(product.originalPrice)}
                    </p>
                  )}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="font-sans text-sm text-green-500 mt-1 font-bold tracking-wide">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </p>
                )}
              </div>
              
              {/* Urgency */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-4">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-2 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Only {left} Left
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-2 transition-all">
                    <Eye size={14} className="text-gray-500"/> <span className="text-[#D4AF37] font-bold">{viewers}</span> people viewing this
                  </span>
                </div>
                {recentPurchases > 0 && (
                  <span className="text-[10px] font-sans tracking-widest uppercase text-green-500 animate-in fade-in slide-in-from-left-2">
                    {recentPurchases} {recentPurchases === 1 ? 'person' : 'people'} bought this recently
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                {product.description}
              </p>

              {/* Size Guide Trigger */}
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors mb-4 w-fit"
              >
                <Ruler size={16} /> Size Guide
              </button>

              {/* Size Selection */}
              <div className="mb-8">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-100 mb-3">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-3">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold transition-all border
                        ${selectedSize === size 
                          ? 'bg-[#D4AF37] text-[#000000] border-[#D4AF37]' 
                          : 'bg-[#111111] text-gray-400 border-[#333333] hover:border-[#D4AF37] hover:text-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-100 mb-3">
                    Key Specs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.specs.map((spec, i) => (
                      <span key={i}
                        className="px-3 py-1.5 bg-[#111111] border border-[#333333] 
                          rounded-full text-xs text-gray-400 font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-100 mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#444444] rounded-full overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500
                        hover:bg-[#111111] transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-gray-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500
                        hover:bg-[#111111] transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Total: <span className="text-gray-100 font-bold">
                      {formatCurrency((product.price || 0) * quantity)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 bg-[#D4AF37] text-[#000000] hover:bg-[#FFFFFF] hover:text-[#000000]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    if (!selectedSize) {
                      toast.error('Please select a size')
                      return
                    }
                    navigate('/checkout', {
                      state: {
                        buyNowItem: {
                          productId: product.id,
                          name:      product.name,
                          brand:     product.brand,
                          price:     product.price,
                          image:     product.image,
                          quantity,
                          size:      selectedSize
                        }
                      }
                    })
                  }}
                  className="w-full py-4 border border-white/20 text-gray-100 
                    rounded-full font-bold text-sm tracking-widest uppercase
                    hover:border-white hover:text-white transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#333333] rounded-xl">
                <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-100">Complimentary Next-Day Delivery</p>
                  <p className="text-xs text-gray-400 mt-0.5">Free shipping on all orders</p>
                </div>
              </div>

              {/* Provenance Card */}
              <ProvenanceCard product={product} />

            </div>
          </div>
        </div>

        {/* AI Outfit Builder */}
        <OutfitBuilder mainProduct={product} relatedProducts={related} />

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="bg-[#000000] py-16 border-t border-[#333333]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-serif text-gray-100">Recently Viewed</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentlyViewed.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowSizeGuide(false) }}>
          <div className="w-full max-w-2xl bg-[#111111] rounded-2xl p-8 relative border border-[#333333] shadow-2xl">
            <button onClick={() => setShowSizeGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 text-center">Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-white uppercase bg-[#222222]">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Size</th>
                    <th className="px-6 py-4">Bust (in)</th>
                    <th className="px-6 py-4">Waist (in)</th>
                    <th className="px-6 py-4 rounded-tr-lg">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#333333]"><td className="px-6 py-4 font-bold text-white">XS</td><td className="px-6 py-4">32</td><td className="px-6 py-4">24</td><td className="px-6 py-4">34</td></tr>
                  <tr className="border-b border-[#333333]"><td className="px-6 py-4 font-bold text-white">S</td><td className="px-6 py-4">34</td><td className="px-6 py-4">26</td><td className="px-6 py-4">36</td></tr>
                  <tr className="border-b border-[#333333]"><td className="px-6 py-4 font-bold text-white">M</td><td className="px-6 py-4">36</td><td className="px-6 py-4">28</td><td className="px-6 py-4">38</td></tr>
                  <tr className="border-b border-[#333333]"><td className="px-6 py-4 font-bold text-white">L</td><td className="px-6 py-4">38</td><td className="px-6 py-4">30</td><td className="px-6 py-4">40</td></tr>
                  <tr><td className="px-6 py-4 font-bold text-white rounded-bl-lg">XL</td><td className="px-6 py-4">40</td><td className="px-6 py-4">32</td><td className="px-6 py-4 rounded-br-lg">42</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center italic">Measurements are indicative. For bespoke fitting, contact our stylists.</p>
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      <VirtualTryOn 
        isOpen={showTryOn} 
        onClose={() => setShowTryOn(false)} 
        productImg={currentImage} 
      />
    </PageTransition>
  )
}
