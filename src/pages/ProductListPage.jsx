import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import { useWishlist } from '../context/WishlistContext'
import { Heart, SlidersHorizontal } from 'lucide-react'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import ProductCardSkeleton from '../components/common/ProductCardSkeleton'
import ProductCard from '../components/common/ProductCard'
import { formatCurrency } from '../utils/currency'
import { useSiteContent } from '../hooks/useSiteContent'

export default function ProductListPage() {
  const { content } = useSiteContent('boutique', {
    heritageTag: '✦ Custom Handloom Weaves', heritageTitle: 'The Heritage Boutique', heritageDesc: 'Drape yourself in royal garments spun with absolute devotion. Our boutique catalog houses authentic pure Banarasi silks, handloom Kanchipuram sarees, and Gota Patti embroidered suites direct from artisanal houses.', 
    atelierTag: '✦ Flagship Experience', atelierTitle: 'Inside Our Atelier', atelierDesc: 'Explore the curated spaces of our physical boutique showroom. Each collection is meticulously organized to offer a sensory journey through India\'s finest handloom craftsmanship and heritage designs.',
    showroomImg1: '', showroomText1: 'Exquisite Heritage Silks', showroomImg2: '', showroomText2: 'Fine Handloom Weaves', showroomImg3: '', showroomText3: 'Zari Embroidered Kurtis', showroomImg4: '', showroomText4: 'Bridal Masterpieces'
  })

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const activeSort = searchParams.get('sort') || 'featured'

  const categories = [
    { name: 'All Boutique', value: 'all' },
    { name: 'Sarees', value: 'sarees' },
    { name: 'Jewellery', value: 'jewellery' },
    { name: 'Lehengas', value: 'lehengas' },
    { name: 'Accessories', value: 'accessories' },
    { name: 'Return Gifts', value: 'return gifts' }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const filters = {
          category: activeCategory === 'all' ? '' : activeCategory,
          search: searchQuery,
          sort: activeSort
        }
        const res = await productService.getAllProducts(filters)
        if (res.success && res.data) {
          let list = [...res.data]
          // Apply client-side sorting if needed to ensure correct behavior
          if (activeSort === 'price-asc') {
            list.sort((a, b) => a.price - b.price)
          } else if (activeSort === 'price-desc') {
            list.sort((a, b) => b.price - a.price)
          } else if (activeSort === 'newest') {
            list.sort((a, b) => (b.isNew ? -1 : 1))
          }
          setProducts(list)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory, searchQuery, activeSort])

  const handleCategorySelect = (val) => {
    const newParams = new URLSearchParams(searchParams)
    if (val === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', val)
    }
    setSearchParams(newParams)
  }

  const handleSortSelect = (val) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', val)
    setSearchParams(newParams)
  }

  const handleClearAll = () => {
    setSearchParams({})
  }

  return (
    <>
      <SEO title="Our Collections" description="Explore our curated boutique collections of heritage wear, jewellery, and luxury return gifts." />
      <PageTransition><div className="min-h-screen bg-[#000000] pb-24">
      
      {/* ── Top Header Banner (Burgundy Theme) ── */}
      {(!searchQuery && activeCategory === 'all') && (
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-[#111111] border border-[#D4AF37]/30 text-[#FFFFFF] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.05)] flex flex-col justify-center min-h-[220px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <span className="inline-block text-[9px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] mb-4 bg-[#D4AF37]/10 px-3 py-1 rounded-sm uppercase">
              {content.heritageTag}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-[#FFFFFF] mb-4 tracking-wide font-normal">
              {content.heritageTitle}
            </h1>
            <p className="text-[#A3A3A3] font-sans text-xs md:text-sm font-light max-w-2xl leading-relaxed whitespace-pre-line">
              {content.heritageDesc}
            </p>
          </div>
        </div>
        </div>
      )}

      {/* ── Showroom Gallery Section ── */}
      {(!searchQuery && activeCategory === 'all') && (
        <div className="max-w-7xl mx-auto px-6 mt-10">
          <div className="bg-[#000000] border border-[#D4AF37]/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(212,175,55,0.03)]">
          <div className="max-w-xl mb-6">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase block mb-2">
              {content.atelierTag}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#FFFFFF]">
              {content.atelierTitle}
            </h2>
            <p className="text-gray-400 font-sans text-xs mt-2 leading-relaxed font-light whitespace-pre-line">
              {content.atelierDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] shadow-sm border border-[#D4AF37]/20">
              <img src={content.showroomImg1 || "/assets/images/boutique_4.jpg"} alt="Showroom Display" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-[9px] font-sans tracking-widest uppercase font-semibold">{content.showroomText1}</p>
              </div>
            </div>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] shadow-sm border border-[#D4AF37]/20">
              <img src={content.showroomImg2 || "/assets/images/boutique_1.jpg"} alt="Showroom Display" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-[9px] font-sans tracking-widest uppercase font-semibold">{content.showroomText2}</p>
              </div>
            </div>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] shadow-sm border border-[#D4AF37]/20">
              <img src={content.showroomImg3 || "/assets/images/boutique_2.jpg"} alt="Showroom Display" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-[9px] font-sans tracking-widest uppercase font-semibold">{content.showroomText3}</p>
              </div>
            </div>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] shadow-sm border border-[#D4AF37]/20">
              <img src={content.showroomImg4 || "/assets/images/boutique_3.jpg"} alt="Showroom Display" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-[9px] font-sans tracking-widest uppercase font-semibold">{content.showroomText4}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* ── Main Workspace: Sidebar & Grid ── */}
      <div className={`max-w-7xl mx-auto px-6 ${(!searchQuery && activeCategory === 'all') ? 'mt-12' : 'pt-8'}`}>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Sidebar Filters */}
          <div className="w-full lg:w-3/12 flex-shrink-0 lg:sticky lg:top-32 h-fit">
            <div className="border-b border-[#444444] pb-4 mb-6 flex items-center justify-between">
              <h2 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-[#FFFFFF] flex items-center gap-2">
                <SlidersHorizontal size={12} strokeWidth={2.5} /> Filter Collection
              </h2>
              {(activeCategory !== 'all' || searchQuery || activeSort !== 'featured') && (
                <button 
                  onClick={handleClearAll}
                  className="text-[10px] font-sans uppercase tracking-widest text-[#D4AF37] hover:text-[#D4AF37] font-semibold transition-colors underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories Selection */}
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-4">
                Categories
              </p>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.value
                  return (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`w-full text-left px-5 py-3.5 text-xs font-sans tracking-widest uppercase transition-all duration-300 rounded-xl font-semibold
                        ${isActive 
                          ? 'bg-[#D4AF37] text-[#000000] shadow-md' 
                          : 'bg-[#000000] text-[#FFFFFF] border border-[#333333] hover:border-gray-300 hover:bg-[#FFFFFF]/5'}`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Grid Content */}
          <div className="w-full lg:w-9/12">
            
            {/* Grid Header Info & Sorting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#333333] pb-6 mb-8">
              <p className="font-sans text-sm text-[#D4AF37]">
                Showing <span className="font-semibold text-[#FFFFFF]">{products.length}</span> luxurious boutique items
              </p>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-sans text-[#D4AF37] whitespace-nowrap">Sort By:</label>
                <select 
                  value={activeSort}
                  onChange={(e) => handleSortSelect(e.target.value)}
                  className="bg-[#000000] border border-[#444444] rounded-xl px-4 py-2.5 text-xs font-sans font-semibold text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="featured">Featured Masterpieces</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Loading / Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-[#000000] rounded-3xl border border-[#333333]">
                <p className="text-4xl mb-4">🌸</p>
                <p className="text-gray-100 font-bold text-lg mb-1">No items found</p>
                <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                  We couldn't find any products matching your selection. Try clearing filters or refining search.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-6 px-8 py-3 rounded-full bg-[#D4AF37] text-[#000000] text-xs font-bold tracking-widest uppercase hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
      </PageTransition>
    </>
  )
}
