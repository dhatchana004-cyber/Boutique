import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import CartDrawer from './components/common/CartDrawer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import UserProfilePage from './pages/UserProfilePage'
import WishlistPage from './pages/WishlistPage'
import MembershipPage from './pages/MembershipPage'
import AdminDashboard from './pages/AdminDashboard'
import ContactPage from './pages/ContactPage'
import ReturnGiftsPage from './pages/ReturnGiftsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import StylingAssistant from './components/assistant/StylingAssistant'

function AppLayout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const lenisRef = useRef(null)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    
    // Tiny delay to ensure scroll resets correctly after DOM updates
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    if (isAdmin) return

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2, // smoother but faster response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isAdmin])


  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '12px 24px',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#111',
            },
          },
        }} 
      />
      {!isAdmin && <Navbar />}
      <CartDrawer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account/orders" element={<OrderHistoryPage />} />
          <Route path="/account/profile" element={<UserProfilePage />} />
          <Route path="/account/membership" element={<Navigate to="/account/profile" state={{ activeTab: 'membership' }} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/return-gifts" element={<ReturnGiftsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && <StylingAssistant />}
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App