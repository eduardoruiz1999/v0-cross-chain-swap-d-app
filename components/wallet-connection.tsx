"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle, Smartphone, Monitor } from "lucide-react"
import { isMobileDevice } from "@/lib/mobile-wallets"

interface WalletConnectionProps {
  onConnect: (method: "metamask" | "privatekey" | "coinbase", data?: string) => void
  isMobile?: boolean
  detectedWallet?: string | null
}

export function WalletConnection({ onConnect, isMobile, detectedWallet }: WalletConnectionProps) {
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async (method: "metamask" | "privatekey" | "coinbase", data?: string) => {
    setError(null)
    setConnecting(true)

    try {
      await onConnect(method, data)
    } catch (err: any) {
      setError(err.message || "Connection failed")
    } finally {
      setConnecting(false)
    }
  }

  const isRealMobile = isMobileDevice()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
        <p className="bright-gray">Choose your connection method</p>

        {isRealMobile && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm">Mobile Device Detected</span>
          </div>
        )}

        {detectedWallet && (
          <Badge variant="secondary" className="mt-2 bg-green-950 text-green-300 border-green-700">
            {detectedWallet.charAt(0).toUpperCase() + detectedWallet.slice(1)} Detected
          </Badge>
        )}
      </div>

      {error && (
        <Alert className="border-red-500 bg-red-950/50 card-bg">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={isRealMobile ? "coinbase" : "metamask"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-600">
          <TabsTrigger value="metamask" className="text-white data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-1">
              {isRealMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
              MetaMask
            </div>
          </TabsTrigger>
          <TabsTrigger value="coinbase" className="text-white data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              Coinbase
            </div>
          </TabsTrigger>
          <TabsTrigger value="privatekey" className="text-white data-[state=active]:bg-gray-700">
            Private Key
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metamask" className="space-y-4">
          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                {isRealMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                MetaMask {isRealMobile ? "Mobile" : "Desktop"}
              </CardTitle>
              <CardDescription className="bright-gray">
                {isRealMobile ? "Connect using MetaMask mobile app" : "Connect using your MetaMask browser extension"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleConnect("metamask")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
                disabled={connecting}
              >
                {connecting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask {isRealMobile ? "Mobile" : ""}
                  </>
                )}
              </Button>

              {isRealMobile && (
                <div className="p-3 bg-orange-950/30 border border-orange-600 rounded-md">
                  <p className="text-orange-300 text-sm">
                    <strong>Mobile:</strong> This will open MetaMask app automatically. Make sure you have it installed.
                  </p>
                </div>
              )}

              {!isRealMobile && typeof window !== "undefined" && !window?.ethereum && (
                <div className="mt-3 p-3 bg-yellow-950/50 border border-yellow-600 rounded-md">
                  <p className="text-yellow-300 text-sm">
                    MetaMask not detected.
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1"
                    >
                      Install MetaMask
                    </a>
                  </p>
                </div>
              )}

              {isRealMobile && (
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Don't have MetaMask Mobile?</p>
                  <a
                    href="https://play.google.com/store/apps/details?id=io.metamask"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 underline text-sm"
                  >
                    Download for Android
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coinbase" className="space-y-4">
          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Coinbase Wallet Mobile
              </CardTitle>
              <CardDescription className="bright-gray">
                Connect using Coinbase Wallet mobile app with Android SDK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleConnect("coinbase")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={connecting}
              >
                {connecting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Connect Coinbase Wallet
                  </>
                )}
              </Button>

              <div className="p-3 bg-blue-950/30 border border-blue-600 rounded-md">
                <p className="text-blue-300 text-sm">
                  <strong>Android SDK:</strong> Optimized for Android devices with deep linking and automatic network
                  switching.
                </p>
              </div>

              {detectedWallet === "coinbase" && (
                <div className="p-3 bg-green-950/30 border border-green-600 rounded-md">
                  <p className="text-green-300 text-sm">
                    ✅ <strong>Coinbase Wallet detected!</strong> Ready to connect.
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2">Don't have Coinbase Wallet?</p>
                <a
                  href="https://play.google.com/store/apps/details?id=org.toshi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  Download for Android
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privatekey" className="space-y-4">
          <Alert className="border-yellow-600 bg-yellow-950/50 card-bg">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              <strong>Development Only:</strong> Never use private keys in production. This method is only for testing
              purposes.
            </AlertDescription>
          </Alert>

          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm">Private Key Connection</CardTitle>
              <CardDescription className="bright-gray">Enter your private key for development testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="privatekey" className="bright-gray">
                  Private Key
                </Label>
                <Input
                  id="privatekey"
                  type={showPrivateKey ? "text" : "password"}
                  placeholder="0x..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-pk"
                  checked={showPrivateKey}
                  onChange={(e) => setShowPrivateKey(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="show-pk" className="bright-gray text-sm">
                  Show private key
                </Label>
              </div>

              <Button
                onClick={() => handleConnect("privatekey", privateKey)}
                disabled={!privateKey || privateKey.length < 64 || connecting}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                size="lg"
              >
                {connecting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </div>
                ) : (
                  "Connect with Private Key"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
