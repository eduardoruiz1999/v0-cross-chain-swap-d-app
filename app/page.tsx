"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowRight, AlertTriangle, Smartphone, Gem } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { usePrices } from "@/hooks/use-prices"
import { useSwap } from "@/hooks/use-swap"
import { PriceTicker } from "@/components/price-ticker"
import { WalletConnection } from "@/components/wallet-connection"
import { SwapForm } from "@/components/swap-form"
import { TransactionHistory } from "@/components/transaction-history"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Configuración del token Diamante
const DIAMANTE_TOKEN_CONFIG = {
  address: "5zJo2GzYRgiZw5j3SBNpuqVcGok35kT3ADwsw74yJWV6",
  name: "Diamante",
  symbol: "DIAMANTE",
  decimals: 9,
  fixedPrice: 6.00, // Precio fijo en USD
  network: "Solana",
  website: "https://diamantesolana.com",
  explorer: "https://solscan.io/token/5zJo2GzYRgiZw5j3SBNpuqVcGok35kT3ADwsw74yJWV6"
}

export default function SwapDApp() {
  const { wallet, connected, connect, disconnect, isMobile, detectedWallet } = useWallet()
  const { prices, loading: pricesLoading, refresh: refreshPrices, currentParity } = usePrices()
  const { swap, loading: swapLoading, progress, error } = useSwap()
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async (method: "megatron" | "privatekey" | "coinbase", data?: string) => {
    setConnectionError(null)
    try {
      await connect(method, data)
    } catch (err: any) {
      setConnectionError(err.message)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen gradient-bg p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Diamante Solana</h1>
            <p className="bright-gray">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Gem className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Diamante Solana</h1>
          </div>
          <p className="bright-gray">Swap DIAMANTE (Solana) to ETH (Ethereum) at fixed ${DIAMANTE_TOKEN_CONFIG.fixedPrice} rate</p>
          
          {/* Token Info Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-cyan-950 text-cyan-300 border-cyan-700">
              <Gem className="h-3 w-3 mr-1" /> {DIAMANTE_TOKEN_CONFIG.symbol}
            </Badge>
            <Badge variant="secondary" className="bg-green-950 text-green-300 border-green-700">
              Price: ${DIAMANTE_TOKEN_CONFIG.fixedPrice} USD
            </Badge>
            <Badge variant="secondary" className="bg-purple-950 text-purple-300 border-purple-700">
              Network: {DIAMANTE_TOKEN_CONFIG.network}
            </Badge>
          </div>

          {isMobile && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm">Mobile Optimized • Android SDK Ready</span>
            </div>
          )}
        </div>

        {/* Connection Error Alert */}
        {connectionError && (
          <Alert className="mb-6 border-red-500 bg-red-950/50 card-bg">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{connectionError}</AlertDescription>
          </Alert>
        )}

        {/* Price Ticker - Actualizado para DIAMANTE */}
        <PriceTicker 
          prices={prices} 
          loading={pricesLoading} 
          onRefresh={refreshPrices} 
          currentParity={currentParity}
          diamantePrice={DIAMANTE_TOKEN_CONFIG.fixedPrice}
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Main Swap Interface */}
          <div className="lg:col-span-2">
            <Card className="card-bg border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Cross-Chain Swap
                </CardTitle>
                <CardDescription className="bright-gray">
                  {DIAMANTE_TOKEN_CONFIG.symbol} ({DIAMANTE_TOKEN_CONFIG.network}) → ETH (Ethereum) • ${DIAMANTE_TOKEN_CONFIG.fixedPrice} Fixed Rate • Mobile Ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <WalletConnection onConnect={handleConnect} isMobile={isMobile} detectedWallet={detectedWallet} />
                ) : (
                  <SwapForm
                    wallet={wallet}
                    prices={prices}
                    onSwap={swap}
                    loading={swapLoading}
                    progress={progress}
                    error={error}
                    diamanteConfig={DIAMANTE_TOKEN_CONFIG}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            {connected && (
              <Card className="card-bg border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet
                    {wallet?.walletType && (
                      <Badge variant="secondary" className="bg-blue-950 text-blue-300 border-blue-700">
                        {wallet.walletType}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="bright-gray">Address</Label>
                    <p className="text-white font-mono text-sm">
                      {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="bright-gray flex items-center gap-1">
                        <Gem className="h-3 w-3" /> {DIAMANTE_TOKEN_CONFIG.symbol} (Solana)
                      </span>
                      <div className="text-right">
                        <span className="text-white">{wallet?.balances?.DIAMANTE || "0"}</span>
                        <div className="text-xs text-cyan-300">
                          ≈ ${((wallet?.balances?.DIAMANTE || 0) * DIAMANTE_TOKEN_CONFIG.fixedPrice).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="bright-gray">SOL (Solana)</span>
                      <span className="text-white">{wallet?.balances?.SOL || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="bright-gray">ETH (Ethereum)</span>
                      <span className="text-white">{wallet?.balances?.ETH || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="bright-gray">USDC (Ethereum)</span>
                      <span className="text-white">{wallet?.balances?.USDC || "0"}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="w-full bg-transparent border-gray-500 text-white hover:bg-gray-800"
                  >
                    Disconnect
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Bridge Info - Actualizado para DIAMANTE */}
            <Card className="card-bg border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Bridge Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bright-gray">Wormhole Bridge</span>
                  <Badge variant="secondary" className="bg-green-950 text-green-300 border-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Est. Time</span>
                  <span className="text-white">5-10 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Fee</span>
                  <span className="text-white">~0.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">{DIAMANTE_TOKEN_CONFIG.symbol} Fixed Price</span>
                  <span className="text-white">${DIAMANTE_TOKEN_CONFIG.fixedPrice} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Token Address</span>
                  <a 
                    href={DIAMANTE_TOKEN_CONFIG.explorer} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-xs"
                  >
                    View on Explorer
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Token Info Card */}
            <Card className="card-bg border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Token Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="bright-gray">Name</span>
                  <span className="text-white">{DIAMANTE_TOKEN_CONFIG.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Symbol</span>
                  <Badge variant="secondary" className="bg-cyan-950 text-cyan-300 border-cyan-700">
                    {DIAMANTE_TOKEN_CONFIG.symbol}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Network</span>
                  <Badge variant="secondary" className="bg-purple-950 text-purple-300 border-purple-700">
                    {DIAMANTE_TOKEN_CONFIG.network}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Decimals</span>
                  <span className="text-white">{DIAMANTE_TOKEN_CONFIG.decimals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Fixed Price</span>
                  <span className="text-green-400 font-bold">${DIAMANTE_TOKEN_CONFIG.fixedPrice} USD</span>
                </div>
                <a 
                  href={DIAMANTE_TOKEN_CONFIG.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full bg-transparent border-cyan-500 text-cyan-300 hover:bg-cyan-950"
                  >
                    Official Website
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <TransactionHistory tokenSymbol={DIAMANTE_TOKEN_CONFIG.symbol} />
          </div>
        </div>
      </div>
    </div>
  )
  }
