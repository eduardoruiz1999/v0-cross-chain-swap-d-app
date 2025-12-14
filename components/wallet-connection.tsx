"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  AlertTriangle, 
  Smartphone, 
  Monitor, 
  Key, 
  Shield,
  Gem,
  Copy,
  Check
} from "lucide-react"
import { isMobileDevice } from "@/lib/mobile-wallets"
import { cn } from "@/lib/utils"

// Llaves privadas de ejemplo para desarrollo
const EXAMPLE_PRIVATE_KEYS = [
  {
    name: "Ejemplo 1",
    key: "27npWoNE4HfmLeQo1TyWcW7NEA28qnsnDK7kcttDQEWrCWnro83HMJ97rMmpvYYZRwDAvG4KRuB7hTBacvwD7bgi",
    note: "Llave de desarrollo - Fondo: 10 SOL"
  },
  {
    name: "Ejemplo 2",
    key: "3kE8H4dR7vJ5qKt8nL2pQw9sXz1yB6cV7aM0nD4fG8hJ2kL5pQ9sX3wZ6bV8cN1mD4fH7jK0lP2qR5tU8vW",
    note: "Llave de desarrollo - Fondo: 5 SOL + 100 DIAMANTE"
  },
  {
    name: "Ejemplo 3",
    key: "7xY9bN4mK2jL8pQ6wR3tS5vU1zC4aB7dF0gH3jK5nM8qR2tV5wY8zB1cD4fG7hJ0lN3pQ6rS9uW2xZ",
    note: "Llave de desarrollo - Solo para pruebas"
  }
];

interface WalletConnectionProps {
  onConnect: (method: "phantom" | "solflare" | "privatekey" | "backpack", data?: string) => void
  isMobile?: boolean
  detectedWallet?: string | null
}

export function WalletConnection({ onConnect, isMobile, detectedWallet }: WalletConnectionProps) {
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleConnect = async (method: "phantom" | "solflare" | "privatekey" | "backpack", data?: string) => {
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
  
  const copyToClipboard = async (text: string, exampleName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(exampleName)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPrivateKey(text)
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  // Detectar wallet de Solana disponible
  const detectSolanaWallet = () => {
    if (typeof window === 'undefined') return null
    
    if (window.solana?.isPhantom) return 'phantom'
    if (window.solflare?.isSolflare) return 'solflare'
    if (window.backpack?.isBackpack) return 'backpack'
    return null
  }

  const availableWallet = detectSolanaWallet()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect Solana Wallet</h3>
        <p className="bright-gray">Connect to swap DIAMANTE tokens at $6 fixed rate</p>

        {isRealMobile && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm">Mobile Device Detected</span>
          </div>
        )}

        {availableWallet && (
          <Badge variant="secondary" className="mt-2 bg-green-950 text-green-300 border-green-700">
            <Gem className="h-3 w-3 mr-1" />
            {availableWallet.charAt(0).toUpperCase() + availableWallet.slice(1)} Detected
          </Badge>
        )}
      </div>

      {error && (
        <Alert className="border-red-500 bg-red-950/50 card-bg">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={availableWallet || "phantom"} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-600">
          <TabsTrigger value="phantom" className="text-white data-[state=active]:bg-cyan-950">
            <div className="flex items-center gap-1">
              {isRealMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
              Phantom
            </div>
          </TabsTrigger>
          <TabsTrigger value="solflare" className="text-white data-[state=active]:bg-purple-950">
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              Solflare
            </div>
          </TabsTrigger>
          <TabsTrigger value="backpack" className="text-white data-[state=active]:bg-blue-950">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Backpack
            </div>
          </TabsTrigger>
          <TabsTrigger value="privatekey" className="text-white data-[state=active]:bg-gray-700">
            <Key className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phantom" className="space-y-4">
          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                {isRealMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                Phantom Wallet {isRealMobile ? "Mobile" : "Desktop"}
              </CardTitle>
              <CardDescription className="bright-gray">
                {isRealMobile 
                  ? "Connect using Phantom mobile app" 
                  : "Connect using your Phantom browser extension"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleConnect("phantom")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
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
                    Connect Phantom {isRealMobile ? "Mobile" : ""}
                  </>
                )}
              </Button>

              {isRealMobile && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-600 rounded-md">
                  <p className="text-cyan-300 text-sm">
                    <strong>Mobile:</strong> This will open Phantom app automatically. Make sure you have it installed.
                  </p>
                </div>
              )}

              {!isRealMobile && typeof window !== "undefined" && !window?.solana?.isPhantom && (
                <Alert className="border-yellow-500 bg-yellow-950/50">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    Phantom not detected.{" "}
                    <a
                      href="https://phantom.app/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1 text-cyan-300"
                    >
                      Install Phantom Extension
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              {isRealMobile && (
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Don't have Phantom Mobile?</p>
                  <a
                    href="https://phantom.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline text-sm"
                  >
                    Download for iOS/Android
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solflare" className="space-y-4">
          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Solflare Wallet
              </CardTitle>
              <CardDescription className="bright-gray">
                Connect using Solflare wallet extension or mobile app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleConnect("solflare")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
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
                    Connect Solflare Wallet
                  </>
                )}
              </Button>

              <div className="p-3 bg-purple-950/30 border border-purple-600 rounded-md">
                <p className="text-purple-300 text-sm">
                  <strong>Multi-platform:</strong> Available as browser extension and mobile app.
                </p>
              </div>

              {typeof window !== "undefined" && window?.solflare?.isSolflare && (
                <div className="p-3 bg-green-950/30 border border-green-600 rounded-md">
                  <p className="text-green-300 text-sm">
                    ✅ <strong>Solflare Wallet detected!</strong> Ready to connect.
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2">Don't have Solflare Wallet?</p>
                <a
                  href="https://solflare.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline text-sm"
                >
                  Download Solflare
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backpack" className="space-y-4">
          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Backpack Wallet
              </CardTitle>
              <CardDescription className="bright-gray">
                Connect using Backpack wallet - Built for Solana developers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleConnect("backpack")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
                    <Shield className="h-4 w-4 mr-2" />
                    Connect Backpack Wallet
                  </>
                )}
              </Button>

              <div className="p-3 bg-blue-950/30 border border-blue-600 rounded-md">
                <p className="text-blue-300 text-sm">
                  <strong>Developer Friendly:</strong> Built with developers in mind. Supports xNFTs and advanced features.
                </p>
              </div>

              {typeof window !== "undefined" && window?.backpack?.isBackpack && (
                <div className="p-3 bg-green-950/30 border border-green-600 rounded-md">
                  <p className="text-green-300 text-sm">
                    ✅ <strong>Backpack Wallet detected!</strong> Ready to connect.
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2">Don't have Backpack Wallet?</p>
                <a
                  href="https://www.backpack.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  Download Backpack
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privatekey" className="space-y-4">
          <Alert className="border-yellow-600 bg-yellow-950/50 card-bg">
            <Key className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              <strong>Development & Testing Only:</strong> Never use private keys in production. 
              This method is only for testing with development wallets.
            </AlertDescription>
          </Alert>

          <Card className="card-bg border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Key className="h-4 w-4" />
                Solana Private Key Connection
              </CardTitle>
              <CardDescription className="bright-gray">
                Enter your Solana private key for development testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ejemplos de llaves privadas para desarrollo */}
              <div className="space-y-3">
                <Label className="bright-gray">Development Keys (Copy & Paste):</Label>
                {EXAMPLE_PRIVATE_KEYS.map((example, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer group"
                    onClick={() => copyToClipboard(example.key, example.name)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-cyan-300 font-medium">{example.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(example.key, example.name)
                        }}
                        className="text-gray-400 hover:text-cyan-400"
                      >
                        {copiedKey === example.name ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 font-mono break-all">
                      {example.key.slice(0, 20)}...{example.key.slice(-20)}
                    </p>
                    <p className="text-xs text-green-400 mt-1">{example.note}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="privatekey" className="bright-gray">
                    Your Private Key
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePaste}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Paste from clipboard
                    </button>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      {showPrivateKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <Input
                    id="privatekey"
                    type={showPrivateKey ? "text" : "password"}
                    placeholder="Enter your 64-88 character Solana private key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className={cn(
                      "bg-gray-800 border-gray-600 text-white font-mono",
                      "focus:border-cyan-500 focus:ring-cyan-500"
                    )}
                  />
                  {privateKey && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Badge 
                        variant={privateKey.length >= 64 ? "secondary" : "destructive"} 
                        className="text-xs"
                      >
                        {privateKey.length} chars
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  <p>• Solana private keys are typically 64-88 characters long</p>
                  <p>• Example format: 5VqjB57PnrTUSQRoN8skwKtstqPrMFJiZaDGz6BF5FuKhSGSYhbcwPdgKPVNbgtWhi9AkJ8z8HvgaBDzccNHjzE3</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleConnect("privatekey", privateKey)}
                  disabled={!privateKey || privateKey.length < 64 || connecting}
                  className={cn(
                    "w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700",
                    "text-white border border-gray-600"
                  )}
                  size="lg"
                >
                  {connecting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Connecting...
                    </div>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Connect with Private Key
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔐 <strong>Security Notice:</strong> This connection is not stored and is only used for the current session.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    )
}

              
