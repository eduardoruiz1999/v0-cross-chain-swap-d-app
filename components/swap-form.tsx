"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowRight, AlertTriangle, Clock } from "lucide-react"
import { Web3Service } from "@/lib/web3-service"
import { CONTRACTS, RECIPIENTS } from "@/lib/contracts"

interface SwapFormProps {
  wallet: any
  prices: any
  onSwap: (params: any) => void
  loading: boolean
  progress: number
  error: string | null
}

const BRIDGE_OPTIONS = [
  { id: "multichain", name: "Multichain", time: "15-30 min", fee: "0.1%", recommended: true },
  { id: "spiritbridge", name: "SpiritBridge", time: "5-15 min", fee: "0.2%", recommended: false },
]

export function SwapForm({ wallet, prices, onSwap, loading, progress, error }: SwapFormProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState(RECIPIENTS[0])
  const [bridge, setBridge] = useState("multichain")
  const [estimatedOutput, setEstimatedOutput] = useState(0)
  const [fiatValue, setFiatValue] = useState(0)
  const [gasPrice, setGasPrice] = useState("0")
  const [swapQuote, setSwapQuote] = useState<{ amountOut: string; path: string[] } | null>(null)

  // Get real swap quote
  useEffect(() => {
    const getQuote = async () => {
      if (amount && wallet?.signer && Number.parseFloat(amount) > 0) {
        try {
          const quote = await Web3Service.getSwapQuote(
            CONTRACTS.JEFE_TOKEN,
            CONTRACTS.USDC_FANTOM,
            amount,
            wallet.signer,
          )
          setSwapQuote(quote)
          setEstimatedOutput(Number.parseFloat(quote.amountOut))
        } catch (error) {
          console.error("Error getting swap quote:", error)
          setSwapQuote(null)
          setEstimatedOutput(0)
        }
      }
    }

    getQuote()
  }, [amount, wallet?.signer])

  // Calculate fiat value
  useEffect(() => {
    if (amount && prices.coingecko) {
      const numAmount = Number.parseFloat(amount)
      setFiatValue(numAmount * prices.coingecko)
    }
  }, [amount, prices])

  // Get gas price
  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const price = await Web3Service.getGasPrice(250)
        setGasPrice(price)
      } catch (error) {
        console.error("Error fetching gas price:", error)
      }
    }

    fetchGasPrice()
  }, [])

  const handleMaxClick = () => {
    setAmount(wallet?.balances?.JEFE || "0")
  }

  const handleSwap = () => {
    if (!wallet?.signer) {
      alert("Please connect your wallet first")
      return
    }

    onSwap({
      amount: Number.parseFloat(amount),
      recipient,
      bridge,
      estimatedOutput,
      signer: wallet.signer,
    })
  }

  const isValidSwap = amount && Number.parseFloat(amount) > 0 && recipient && !loading && wallet?.signer

  return (
    <div className="space-y-6">
      {/* From Token */}
      <div className="space-y-2">
        <Label className="bright-gray">From (Fantom)</Label>
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">JEFE</span>
                </div>
                <span className="text-white font-medium">JEFE</span>
                <Badge variant="secondary" className="bg-blue-950 text-blue-300 border-blue-700">
                  Fantom
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleMaxClick} className="text-gray-400 hover:text-white">
                Max
              </Button>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xl font-bold bg-transparent border-none p-0 text-white"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Balance: {wallet?.balances?.JEFE || "0"} JEFE</span>
              <span className="text-gray-400">≈ ${fiatValue.toFixed(2)} USD</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center">
        <div className="bg-gray-700 p-2 rounded-full border border-gray-600">
          <ArrowDown className="h-4 w-4 text-gray-300" />
        </div>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <Label className="bright-gray">To (Ethereum)</Label>
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">ETH</span>
              </div>
              <span className="text-white font-medium">Ethereum</span>
              <Badge variant="secondary" className="bg-gray-950 text-gray-300 border-gray-700">
                Ethereum
              </Badge>
            </div>
            <div className="text-xl font-bold text-white">
              {swapQuote ? (Number.parseFloat(swapQuote.amountOut) / 3000).toFixed(6) : estimatedOutput.toFixed(6)} ETH
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {swapQuote ? "Real quote from SpookySwap" : "Estimated output (includes bridge fees)"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bridge Selection */}
      <div className="space-y-2">
        <Label className="bright-gray">Bridge</Label>
        <Select value={bridge} onValueChange={setBridge}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {BRIDGE_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id} className="text-white hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <span>{option.name}</span>
                  {option.recommended && (
                    <Badge variant="secondary" className="bg-green-950 text-green-300 border-green-700">
                      Recommended
                    </Badge>
                  )}
                  <span className="text-gray-400">({option.time})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recipient Selection */}
      <div className="space-y-2">
        <Label className="bright-gray">Recipient Address</Label>
        <Select value={recipient} onValueChange={setRecipient}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {RECIPIENTS.map((addr, index) => (
              <SelectItem key={addr} value={addr} className="text-white hover:bg-gray-700">
                <div className="font-mono">
                  Wallet {index + 1}: {addr.slice(0, 6)}...{addr.slice(-4)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gas Info */}
      <Card className="bg-gray-800/30 border-gray-600">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="bright-gray">Gas Price (Fantom):</span>
            <span className="text-white">{gasPrice} Gwei</span>
          </div>
          {swapQuote && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="bright-gray">Swap Path:</span>
              <span className="text-white text-xs">{swapQuote.path.length} hops</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bridge Info */}
      {bridge && (
        <Card className="bg-blue-950/20 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 font-medium">Bridge Information</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="bright-gray">Estimated Time:</span>
                <span className="text-white">{BRIDGE_OPTIONS.find((b) => b.id === bridge)?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="bright-gray">Bridge Fee:</span>
                <span className="text-white">{BRIDGE_OPTIONS.find((b) => b.id === bridge)?.fee}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-600 bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress */}
      {loading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="bright-gray">Transaction Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="bg-gray-800" />
        </div>
      )}

      {/* Swap Button */}
      <Button
        onClick={handleSwap}
        disabled={!isValidSwap}
        className="w-full h-12 text-lg font-semibold bg-white text-black hover:bg-gray-200"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            Processing Swap...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Swap & Bridge
          </div>
        )}
      </Button>

      {/* Transaction Flow */}
      <Card className="bg-gray-800/30 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm bright-gray mb-2">Real Transaction Flow:</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>1. Swap JEFE → USDC (SpookySwap)</span>
            <ArrowRight className="h-3 w-3" />
            <span>2. Bridge USDC (Multichain)</span>
            <ArrowRight className="h-3 w-3" />
            <span>3. Auto-swap USDC → ETH</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
