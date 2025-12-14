"use client"

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getDiamanteBalance } from '@/lib/solana-config'
import { DIAMANTE_CONFIG } from '@/config/token'

export function useDiamanteBalance() {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState("0")
  const [loading, setLoading] = useState(false)
  const [valueUSD, setValueUSD] = useState("0")

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connected) {
        setBalance("0")
        setValueUSD("150000000000")
        return
      }

      setLoading(true)
      try {
        const diamanteBalance = await getDiamanteBalance(publicKey.toString())
        setBalance(diamanteBalance)
        
        // Calcular valor en USD
        const value = (parseFloat(diamanteBalance) * DIAMANTE_CONFIG.fixedPrice).toFixed(2)
        setValueUSD(value)
      } catch (error) {
        console.error("Error fetching balance:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    
    // Opcional: Pooling cada 30 segundos
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [publicKey, connected])

  return { balance, valueUSD, loading }
  }
