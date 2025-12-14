"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Zap } from "lucide-react"

interface PriceTickerProps {
  prices: {
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
  } | null
  loading: boolean
  onRefresh: () => void
  currentParity: number
}

export function PriceTicker({ prices, loading, onRefresh, currentParity }: PriceTickerProps) {
  const formatPrice = (price?: number) => {
    if (!price) return "N/A"
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatETHPrice = (ethAmount?: number) => {
    if (!ethAmount) return "N/A"
    return `${ethAmount} ETH`
  }

  const getPriceChange = () => {
    return Math.random() > 0.5 ? 2.34 : -1.23
  }

  const priceChange = getPriceChange()

  return (
    <Card className="card-bg border-gray-600">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">JEFE Price Feed</h3>
            {prices?.jefe.parity && (
              <Badge variant="secondary" className="bg-yellow-950 text-yellow-300 border-yellow-700">
                <Zap className="h-3 w-3 mr-1" />
                1:1 ETH Parity
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Main JEFE Price Display */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-950/30 to-orange-950/30 border border-yellow-700">
          <div className="text-center">
            <div className="text-sm text-yellow-300 mb-1">JEFE Token</div>
            <div className="text-3xl font-bold text-white mb-2">{formatPrice(prices?.jefe.usd)}</div>
            <div className="text-lg text-yellow-300 mb-2">= {formatETHPrice(prices?.jefe.eth)}</div>
            <div className="flex items-center justify-center gap-1">
              {priceChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm ${priceChange > 0 ? "text-green-400" : "text-red-400"}`}>
                {priceChange > 0 ? "+" : ""}
                {priceChange.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* ETH Reference Price */}
        <div className="mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">ETH Reference Price:</span>
            <span className="text-white font-semibold">{formatPrice(prices?.eth.usd)}</span>
          </div>
        </div>

        {/* Price Sources Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CoinGecko */}
          <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">CoinGecko ETH</div>
            <div className="text-lg font-bold text-white">{formatPrice(prices?.sources.coingecko)}</div>
            <Badge variant="secondary" className="mt-1 bg-purple-950 text-purple-300 border-purple-700">
              API
            </Badge>
          </div>

          {/* Coinbase */}
          <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Coinbase ETH</div>
            <div className="text-lg font-bold text-white">{formatPrice(prices?.sources.coinbase)}</div>
            <Badge variant="secondary" className="mt-1 bg-blue-950 text-blue-300 border-blue-700">
              CEX
            </Badge>
          </div>

          {/* Binance */}
          <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Binance ETH</div>
            <div className="text-lg font-bold text-white">{formatPrice(prices?.sources.binance)}</div>
            <Badge variant="secondary" className="mt-1 bg-yellow-950 text-yellow-300 border-yellow-700">
              CEX
            </Badge>
          </div>
        </div>

        {/* Parity Information */}
        <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-600 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 font-medium">Price Parity Active</span>
          </div>
          <p className="text-yellow-200 text-sm">
            JEFE token is pegged at {currentParity}:1 ratio with ETH. Current rate: 1 JEFE = {currentParity} ETH ={" "}
            {formatPrice(prices?.jefe.usd)}
          </p>
        </div>

        {loading && <div className="text-center text-gray-400 text-sm mt-4">Updating prices...</div>}
      </CardContent>
    </Card>
  )
}
