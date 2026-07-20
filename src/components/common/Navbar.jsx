import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { Search, ShoppingBag, User, Heart, X, Camera } from 'lucide-react'
import VoiceSearch from '../discovery/VoiceSearch'
import VisualSearchModal from '../discovery/VisualSearchModal'

export default function Navbar() {
  const { cartCount, setIsCartDrawerOpen } = useCart()
  const { wishlistCount } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visualSearchOpen, setVisualSearchOpen] = useState(false)

  const handleVoiceResult = (transcript) => {
    setSearchQuery(transcript)
    setSearchActive(true)
    navigate(`/products?search=${encodeURIComponent(transcript)}`)
  }

  return (
    <nav className="w-full bg-[#000000] sticky top-0 z-50 border-b border-[#FFFFFF]/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo (Left) */}
        <div className="flex-shrink-0">
          <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#FFFFFF] hover:text-[#D4AF37] transition-colors">
            VEDHIKA BRAND
          </Link>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1 mx-8">
          <Link to="/products" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors">
            Boutique
          </Link>
          <Link to="/return-gifts" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors">
            Return Gifts
          </Link>
          <Link to="/about" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-5">

          {/* Inline Expanding Search Bar */}
          {searchActive ? (
            <div className="flex items-center gap-1 bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 rounded-full px-4 py-1.5 w-[220px] md:w-[300px] transition-all duration-300">
              <input
                type="text"
                placeholder="Search weaves, gifts..."
                className="bg-transparent border-none outline-none text-[11px] font-sans w-full text-[#FFFFFF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
                  }
                }}
                autoFocus
              />
              <VoiceSearch onResult={handleVoiceResult} />

              <button onClick={() => setSearchActive(false)} className="p-1.5 text-[#FFFFFF]/40 hover:text-[#FFFFFF] transition-colors rounded-full ml-1">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchActive(true)} className="text-[#FFFFFF] hover:text-[#D4AF37] transition-colors p-1">
                <Search size={18} strokeWidth={1.5} />
              </button>

            </div>
          )}

          {/* Wishlist Link */}
          <Link to="/wishlist" className="relative text-[#FFFFFF] hover:text-[#D4AF37] transition-colors p-1">
            <Heart size={18} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          {isLoggedIn ? (
            <div className="relative group hidden sm:block">
              <button onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/account/profile')} className="text-[#FFFFFF] hover:text-[#D4AF37] transition-colors flex items-center p-1">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-[#FFFFFF]/10 shadow-sm group-hover:border-[#D4AF37] transition-all"
                  />
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
              </button>
              <div className="absolute right-0 top-8 w-48 bg-[#000000] border border-[#FFFFFF]/10 shadow-xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 rounded-sm">
                <div className="px-4 py-2 border-b border-[#FFFFFF]/5 flex items-center gap-2">
                  {user?.avatar && (
                    <img src={user.avatar} className="w-5 h-5 rounded-full object-cover border border-[#FFFFFF]/10" alt="" />
                  )}
                  <p className="text-xs font-serif text-[#FFFFFF] truncate">{user?.name}</p>
                </div>
                {user?.role === 'ADMIN' ? (
                  <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-3 text-[11px] font-sans tracking-widest uppercase text-[#D4AF37] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5">Admin Panel</button>
                ) : (
                  <>
                    <button onClick={() => navigate('/account/profile', { state: { activeTab: 'profile' } })} className="w-full text-left px-4 py-3 text-[11px] font-sans tracking-widest uppercase text-[#D4AF37] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5">My Profile</button>
                    <button onClick={() => navigate('/account/profile', { state: { activeTab: 'membership' } })} className="w-full text-left px-4 py-3 text-[11px] font-sans tracking-widest uppercase text-[#D4AF37] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5">VIP Dashboard</button>
                    <button onClick={() => navigate('/account/orders')} className="w-full text-left px-4 py-3 text-[11px] font-sans tracking-widest uppercase text-[#D4AF37] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5">Order History</button>
                  </>
                )}
                <button onClick={() => { logout(); navigate('/') }} className="w-full text-left px-4 py-3 text-[11px] font-sans tracking-widest uppercase text-red-500 hover:bg-red-50">Sign Out</button>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="hidden sm:block text-[#FFFFFF] hover:text-[#D4AF37] transition-colors p-1">
              <User size={18} strokeWidth={1.5} />
            </button>
          )}

          {/* Cart */}
          <button onClick={() => setIsCartDrawerOpen(true)} className="flex items-center gap-2 text-[#FFFFFF] hover:text-[#D4AF37] transition-colors p-1 relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:hidden bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase hidden sm:block mt-[2px]">
              Cart ({cartCount})
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#FFFFFF] ml-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#000000] border-t border-[#FFFFFF]/5 px-6 py-6 flex flex-col gap-6 shadow-xl absolute w-full z-40">
          <Link to="/products" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]" onClick={() => setMenuOpen(false)}>Boutique</Link>
          <Link to="/return-gifts" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]" onClick={() => setMenuOpen(false)}>Return Gifts</Link>
          <Link to="/about" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]" onClick={() => setMenuOpen(false)}>Contact</Link>

          {isLoggedIn ? (
            <div className="pt-4 border-t border-[#FFFFFF]/5 flex flex-col gap-4">
              <div className="flex items-center gap-2.5 px-1 py-1">
                {user?.avatar && (
                  <img src={user.avatar} className="w-6 h-6 rounded-full object-cover border border-[#FFFFFF]/10" alt="" />
                )}
                <span className="text-xs font-serif text-[#FFFFFF]">{user?.name}</span>
              </div>
              {user?.role === 'ADMIN' ? (
                <button onClick={() => { navigate('/admin'); setMenuOpen(false); }} className="text-left text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">Admin Panel</button>
              ) : (
                <>
                  <button onClick={() => { navigate('/account/profile', { state: { activeTab: 'profile' } }); setMenuOpen(false); }} className="text-left text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">My Profile</button>
                  <button onClick={() => { navigate('/account/profile', { state: { activeTab: 'membership' } }); setMenuOpen(false); }} className="text-left text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">VIP Dashboard</button>
                </>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }} className="text-left text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-red-500">Sign Out</button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#FFFFFF]/5">
              <Link to="/login" className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D4AF37]" onClick={() => setMenuOpen(false)}>Login</Link>
            </div>
          )}
        </div>
      )}


    </nav>
  )
}