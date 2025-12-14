"use client"

import { useState, useCallback, useEffect } from "react"
import { ethers } from "ethers"
import { Web3Service } from "@/lib/web3-service"
import { CONTRACTS } from "@/lib/contracts"
import { CoinbaseWalletSDK, MetaMaskMobileSDK, detectMobileWallet, isMobileDevice } from "@/lib/mobile-wallets"

interface WalletState {
  address: string
  balances: {
    JEFE: string
    ETH: string
    USDC: string
    FTM: string
  }
  chainId: number
  signer?: ethers.Signer
  walletType?: "metamask" | "coinbase" | "privatekey"
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Auto-detect mobile wallet on mount
    if (isMobileDevice()) {
      const detectedWallet = detectMobileWallet()
      if (detectedWallet) {
        console.log(`Detected mobile wallet: ${detectedWallet}`)
      }
    }
  }, [])

  // Load real balances
  const loadBalances = async (address: string, signer: ethers.Signer, chainId: number) => {
    try {
      const [jefeBalance, ftmBalance, ethBalance, usdcBalance] = await Promise.all([
        Web3Service.getTokenBalance(CONTRACTS.JEFE_TOKEN, address, 250),
        Web3Service.getNativeBalance(address, 250),
        Web3Service.getNativeBalance(address, 1),
        Web3Service.getTokenBalance(CONTRACTS.USDC_ETHEREUM, address, 1),
      ])

      return {
        JEFE: jefeBalance,
        FTM: ftmBalance,
        ETH: ethBalance,
        USDC: usdcBalance,
      }
    } catch (error) {
      console.error("Error loading balances:", error)
      return {
        JEFE: "0",
        FTM: "0",
        ETH: "0",
        USDC: "0",
      }
    }
  }

  const connect = useCallback(
    async (method: "metamask" | "privatekey" | "coinbase", privateKey?: string) => {
      if (!mounted) return

      setLoading(true)
      try {
        if (method === "metamask") {
          const isMobile = isMobileDevice()

          if (isMobile) {
            // Use MetaMask Mobile SDK
            const metamaskSDK = MetaMaskMobileSDK.getInstance()
            const { address, provider } = await metamaskSDK.connect()

            // Switch to Fantom network
            await metamaskSDK.switchToFantom()

            const ethersProvider = new ethers.BrowserProvider(provider)
            const signer = await ethersProvider.getSigner()
            const chainId = Number((await ethersProvider.getNetwork()).chainId)

            const balances = await loadBalances(address, signer, chainId)

            setWallet({
              address,
              balances,
              chainId,
              signer,
              walletType: "metamask",
            })
            setConnected(true)
          } else {
            // Desktop MetaMask
            if (typeof window === "undefined") {
              throw new Error("MetaMask can only be used in browser environment")
            }

            if (!window.ethereum) {
              throw new Error("MetaMask is not installed. Please install MetaMask extension.")
            }

            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            })

            if (!accounts || accounts.length === 0) {
              throw new Error("No accounts found. Please unlock MetaMask.")
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const chainId = Number((await provider.getNetwork()).chainId)

            // Switch to Fantom if not already
            if (chainId !== 250) {
              await Web3Service.switchNetwork(250)
            }

            const balances = await loadBalances(accounts[0], signer, chainId)

            setWallet({
              address: accounts[0],
              balances,
              chainId,
              signer,
              walletType: "metamask",
            })
            setConnected(true)
          }
        } else if (method === "coinbase") {
          const isMobile = isMobileDevice()

          if (isMobile) {
            // Use Coinbase Mobile SDK
            const coinbaseSDK = CoinbaseWalletSDK.getInstance()
            const { address, provider } = await coinbaseSDK.connect()

            // Switch to Fantom network
            await coinbaseSDK.switchToFantom()

            const ethersProvider = new ethers.BrowserProvider(provider)
            const signer = await ethersProvider.getSigner()
            const chainId = Number((await ethersProvider.getNetwork()).chainId)

            const balances = await loadBalances(address, signer, chainId)

            setWallet({
              address,
              balances,
              chainId,
              signer,
              walletType: "coinbase",
            })
            setConnected(true)
          } else {
            throw new Error(
              "Coinbase Wallet is primarily for mobile. Please use MetaMask on desktop or switch to mobile.",
            )
          }
        } else if (method === "privatekey" && privateKey) {
          if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
            throw new Error("Invalid private key format. Must be 64 characters starting with 0x")
          }

          const provider = new ethers.JsonRpcProvider("https://rpc.ftm.tools/")
          const signer = new ethers.Wallet(privateKey, provider)
          const address = await signer.getAddress()

          const balances = await loadBalances(address, signer, 250)

          setWallet({
            address,
            balances,
            chainId: 250,
            signer,
            walletType: "privatekey",
          })
          setConnected(true)
        }
      } catch (error) {
        console.error("Connection failed:", error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [mounted],
  )

  const disconnect = useCallback(() => {
    setWallet(null)
    setConnected(false)
  }, [])

  const refreshBalances = useCallback(async () => {
    if (!wallet || !wallet.signer) return

    try {
      const balances = await loadBalances(wallet.address, wallet.signer, wallet.chainId)
      setWallet((prev) => (prev ? { ...prev, balances } : null))
    } catch (error) {
      console.error("Error refreshing balances:", error)
    }
  }, [wallet])

  return {
    wallet,
    connected,
    loading,
    connect,
    disconnect,
    refreshBalances,
    isMobile: isMobileDevice(),
    detectedWallet: detectMobileWallet(),
  }
}
