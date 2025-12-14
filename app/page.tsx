"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowRight, AlertTriangle, Smartphone } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { usePrices } from "@/hooks/use-prices"
import { useSwap } from "@/hooks/use-swap"
import { PriceTicker } from "@/components/price-ticker"
import { WalletConnection } from "@/components/wallet-connection"
import { SwapForm } from "@/components/swap-form"
import { TransactionHistory } from "@/components/transaction-history"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SwapDApp() {
  const { wallet, connected, connect, disconnect, isMobile, detectedWallet } = useWallet()
  const { prices, loading: pricesLoading, refresh: refreshPrices, currentParity } = usePrices()
  const { swap, loading: swapLoading, progress, error } = useSwap()
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async (method: "metamask" | "privatekey" | "coinbase", data?: string) => {
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
            <h1 className="text-4xl font-bold text-white mb-2">JEFE Cross-Chain Swap</h1>
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
          <h1 className="text-4xl font-bold text-white mb-2">JEFE Cross-Chain Swap</h1>
          <p className="bright-gray">Swap JEFE (Fantom) to ETH (Ethereum) with 1:1 parity</p>

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

        {/* Price Ticker */}
        <PriceTicker prices={prices} loading={pricesLoading} onRefresh={refreshPrices} currentParity={currentParity} />

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
                  JEFE (Fantom) → ETH (Ethereum) • 1:1 Parity • Mobile Ready
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
                    <div className="flex justify-between">
                      <span className="bright-gray">JEFE (Fantom)</span>
                      <span className="text-white">{wallet?.balances?.JEFE || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="bright-gray">ETH (Ethereum)</span>
                      <span className="text-white">{wallet?.balances?.ETH || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="bright-gray">FTM (Fantom)</span>
                      <span className="text-white">{wallet?.balances?.FTM || "0"}</span>
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

            {/* Bridge Info */}
            <Card className="card-bg border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Bridge Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bright-gray">Multichain</span>
                  <Badge variant="secondary" className="bg-green-950 text-green-300 border-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Est. Time</span>
                  <span className="text-white">15-30 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">Fee</span>
                  <span className="text-white">~0.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="bright-gray">JEFE/ETH Parity</span>
                  <span className="text-white">1:1</span>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
