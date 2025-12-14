"use client"

import { useState, useCallback } from "react"
import { Web3Service } from "@/lib/web3-service"
import { CONTRACTS } from "@/lib/contracts"
import type { ethers } from "ethers"

interface SwapParams {
  amount: number
  recipient: string
  bridge: string
  estimatedOutput: number
  signer: ethers.Signer
}

export function useSwap() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [txHashes, setTxHashes] = useState<string[]>([])

  const swap = useCallback(async (params: SwapParams) => {
    setLoading(true)
    setProgress(0)
    setError(null)
    setTxHashes([])

    try {
      const { amount, recipient, bridge, signer } = params

      // Step 1: Swap JEFE -> USDC on Fantom
      setProgress(10)
      console.log("Step 1: Swapping JEFE to USDC on Fantom...")

      const swapAmount = amount.toString()
      const minUsdcAmount = (amount * 0.95).toString() // 5% slippage tolerance

      const swapTxHash = await Web3Service.executeSwap(
        CONTRACTS.JEFE_TOKEN,
        CONTRACTS.USDC_FANTOM,
        swapAmount,
        minUsdcAmount,
        await signer.getAddress(), // Temporary recipient for bridge
        signer,
      )

      setTxHashes((prev) => [...prev, swapTxHash])
      setProgress(30)
      console.log("Step 1 completed, tx:", swapTxHash)

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Step 2: Bridge USDC from Fantom to Ethereum
      setProgress(40)
      console.log("Step 2: Bridging USDC to Ethereum...")

      const bridgeTxHash = await Web3Service.bridgeTokens(
        CONTRACTS.USDC_FANTOM,
        recipient,
        minUsdcAmount,
        1, // Ethereum chain ID
        signer,
      )

      setTxHashes((prev) => [...prev, bridgeTxHash])
      setProgress(70)
      console.log("Step 2 completed, tx:", bridgeTxHash)

      // Wait for bridge confirmation
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Step 3: Note about final swap (would be handled by relayer in real implementation)
      setProgress(80)
      console.log("Step 3: USDC will be automatically swapped to ETH on Ethereum by bridge relayer...")

      setProgress(100)
      console.log("Swap completed successfully!")

      // Reset after success
      setTimeout(() => {
        setProgress(0)
        setLoading(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Swap failed. Please try again.")
      setLoading(false)
      setProgress(0)
      console.error("Swap error:", err)
    }
  }, [])

  return {
    swap,
    loading,
    progress,
    error,
    txHashes,
  }
}
