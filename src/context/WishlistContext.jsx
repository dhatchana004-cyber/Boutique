import { createContext, useContext, useState, useEffect } from 'react'
import { wishlistService } from '../services/wishlistService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist on mount or auth change
  useEffect(() => {
    let mounted = true
    if (isLoggedIn) {
      setLoading(true)
      wishlistService.getWishlist()
        .then(res => {
          if (mounted && res.success) {
            setWishlistItems(res.data)
          }
        })
        .catch(console.error)
        .finally(() => {
          if (mounted) setLoading(false)
        })
    } else {
      setWishlistItems([]) // clear when logged out
    }
    return () => { mounted = false }
  }, [isLoggedIn])

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to add favorites')
      window.location.href = '/login'
      return false
    }
    
    // Optimistic Update
    const originallyWished = isWished(productId);
    if (originallyWished) {
      setWishlistItems(prev => prev.filter(item => Number(item.productId) !== Number(productId)))
    } else {
      setWishlistItems(prev => [...prev, { productId: Number(productId) }])
    }

    try {
      const res = await wishlistService.toggleWishlist(productId)
      if (res.success) {
        toast.success(res.wished ? 'Added to Wishlist' : 'Removed from Wishlist')
        if (res.wished) {
          // Silently fetch full details in background so Wishlist page has full product data
          wishlistService.getWishlist().then(fresh => {
            if (fresh.success) setWishlistItems(fresh.data)
          }).catch(console.error)
        }
        return res.wished
      } else {
        // Revert optimistic update on failure
        toast.error('Failed to update wishlist')
        if (originallyWished) {
          setWishlistItems(prev => [...prev, { productId: Number(productId) }])
        } else {
          setWishlistItems(prev => prev.filter(item => Number(item.productId) !== Number(productId)))
        }
      }
    } catch (e) {
      console.error(e)
      toast.error('Error updating wishlist')
      // Revert optimistic update on error
      if (originallyWished) {
        setWishlistItems(prev => [...prev, { productId: Number(productId) }])
      } else {
        setWishlistItems(prev => prev.filter(item => Number(item.productId) !== Number(productId)))
      }
    }
    return null
  }

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) return
    try {
      const res = await wishlistService.removeFromWishlist(productId)
      if (res.success) {
        setWishlistItems(prev => prev.filter(item => Number(item.productId) !== Number(productId)))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const isWished = (productId) => wishlistItems.some(item => Number(item.productId) === Number(productId))

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loading,
      toggleWishlist,
      removeFromWishlist,
      isWished
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
