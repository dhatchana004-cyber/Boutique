import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
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

  const [categories, setCategories] = useState([{ name: 'All Boutique', value: 'all' }])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/content/categories')
        const list = res.data?.data?.list || ['Sarees', 'Jewellery', 'Lehengas', 'Accessories', 'Return Gifts']
        setCategories([
          { name: 'All Boutique', value: 'all' },
          ...list.map(c => ({ name: c, value: c.toLowerCase() }))
        ])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setCategories([
          { name: 'All Boutique', value: 'all' },
          { name: 'Sarees', value: 'sarees' },
          { name: 'Jewellery', value: 'jewellery' },
          { name: 'Lehengas', value: 'lehengas' },
          { name: 'Accessories', value: 'accessories' },
          { name: 'Return Gifts', value: 'return gifts' }
        ])
      }
    }
    
    fetchCategories()

    // Refresh categories when switching tabs back to this page
    window.addEventListener('focus', fetchCategories)
    return () => window.removeEventListener('focus', fetchCategories)
  }, [])

  const matchedCategory = categories.find(c => c.value === searchQuery.toLowerCase())?.value
  const displayActiveCategory = matchedCategory || activeCategory

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
    newParams.delete('search')
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
      
      {/* ── Main Workspace: Sidebar & Grid ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
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
                  const isActive = displayActiveCategory === cat.value
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
