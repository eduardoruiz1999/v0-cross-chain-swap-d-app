"use client"

import { useState, useEffect, useCallback } from "react"
import { PriceService } from "@/lib/price-service"

interface PriceData {
  jefe: {
    usd: number
    eth: number
    parity: boolean
  }
  eth: {
    usd: number
  }
  sources: {
    coingecko: number
    coinbase: number
    binance: number
  }
}

export function usePrices() {
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchPrices = useCallback(async () => {
    if (!mounted) return

    setLoading(true)
    setError(null)

    try {
      const priceData = await PriceService.getAllPrices()
      setPrices(priceData)
    } catch (err: any) {
      setError(err.message || "Failed to fetch prices")
      console.error("Price fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [mounted])

  const setParity = useCallback(
    (ratio: number) => {
      PriceService.setJEFEParity(ratio)
      fetchPrices() // Refresh prices with new parity
    },
    [fetchPrices],
  )

  useEffect(() => {
    if (!mounted) return

    fetchPrices()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [fetchPrices, mounted])

  return {
    prices,
    loading,
    error,
    refresh: fetchPrices,
    setParity,
    currentParity: PriceService.getJEFEParity(),
  }
}
