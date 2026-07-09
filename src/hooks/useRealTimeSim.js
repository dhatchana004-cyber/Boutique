import { useState, useEffect } from 'react'

export function useRealTimeSim(baseViewers = 10, baseLeft = 5) {
  const [viewers, setViewers] = useState(baseViewers)
  const [left, setLeft] = useState(baseLeft)
  const [recentPurchases, setRecentPurchases] = useState(0)

  useEffect(() => {
    // Simulate real-time viewer fluctuations
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        return Math.max(1, prev + change)
      })
    }, 5000)

    // Simulate inventory dropping / recent purchases
    const purchaseInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 15s to "sell" one
        setLeft(prev => Math.max(1, prev - 1))
        setRecentPurchases(prev => prev + 1)
      }
    }, 15000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(purchaseInterval)
    }
  }, [])

  return { viewers, left, recentPurchases }
}
