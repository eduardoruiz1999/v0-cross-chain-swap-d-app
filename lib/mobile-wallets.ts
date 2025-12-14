// Coinbase Wallet Mobile SDK Configuration
export class CoinbaseWalletSDK {
  private static instance: CoinbaseWalletSDK
  private provider: any = null

  static getInstance(): CoinbaseWalletSDK {
    if (!CoinbaseWalletSDK.instance) {
      CoinbaseWalletSDK.instance = new CoinbaseWalletSDK()
    }
    return CoinbaseWalletSDK.instance
  }

  async connect(): Promise<{ address: string; provider: any }> {
    try {
      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile && typeof window !== "undefined") {
        // Try to detect Coinbase Wallet app
        if (window.ethereum?.isCoinbaseWallet) {
          this.provider = window.ethereum

          const accounts = await this.provider.request({
            method: "eth_requestAccounts",
          })

          return {
            address: accounts[0],
            provider: this.provider,
          }
        }

        // If Coinbase Wallet not detected, try deep link
        const currentUrl = encodeURIComponent(window.location.href)
        const coinbaseDeepLink = `https://go.cb-w.com/dapp?cb_url=${currentUrl}`

        // Create a temporary provider for the connection attempt
        const tempProvider = {
          request: async (args: any) => {
            if (args.method === "eth_requestAccounts") {
              // Redirect to Coinbase Wallet
              window.location.href = coinbaseDeepLink

              // Return a promise that resolves when user returns
              return new Promise((resolve, reject) => {
                const checkConnection = () => {
                  if (window.ethereum?.isCoinbaseWallet) {
                    resolve(window.ethereum.request(args))
                  } else {
                    setTimeout(checkConnection, 1000)
                  }
                }

                // Start checking after 3 seconds
                setTimeout(checkConnection, 3000)

                // Timeout after 30 seconds
                setTimeout(() => {
                  reject(new Error("Connection timeout. Please make sure Coinbase Wallet is installed."))
                }, 30000)
              })
            }

            return window.ethereum?.request(args)
          },
        }

        this.provider = tempProvider
        const accounts = await this.provider.request({
          method: "eth_requestAccounts",
        })

        return {
          address: accounts[0],
          provider: window.ethereum || this.provider,
        }
      }

      throw new Error("Coinbase Wallet is only available on mobile devices")
    } catch (error) {
      console.error("Coinbase Wallet connection error:", error)
      throw error
    }
  }

  async switchToFantom(): Promise<void> {
    if (!this.provider) throw new Error("Provider not initialized")

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xfa" }], // 250 in hex
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xfa",
              chainName: "Fantom Opera",
              rpcUrls: ["https://rpc.ftm.tools/"],
              nativeCurrency: {
                name: "Fantom",
                symbol: "FTM",
                decimals: 18,
              },
              blockExplorerUrls: ["https://ftmscan.com"],
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }
}

// MetaMask Mobile SDK Configuration
export class MetaMaskMobileSDK {
  private static instance: MetaMaskMobileSDK
  private provider: any = null

  static getInstance(): MetaMaskMobileSDK {
    if (!MetaMaskMobileSDK.instance) {
      MetaMaskMobileSDK.instance = new MetaMaskMobileSDK()
    }
    return MetaMaskMobileSDK.instance
  }

  async connect(): Promise<{ address: string; provider: any }> {
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile && typeof window !== "undefined") {
        // Check if MetaMask mobile is available
        if (window.ethereum?.isMetaMask) {
          this.provider = window.ethereum

          const accounts = await this.provider.request({
            method: "eth_requestAccounts",
          })

          return {
            address: accounts[0],
            provider: this.provider,
          }
        }

        // Try MetaMask deep link for mobile
        const currentUrl = encodeURIComponent(window.location.href)
        const metamaskDeepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`

        // Create connection handler
        const connectToMetaMask = async () => {
          // Try to open MetaMask app
          window.location.href = metamaskDeepLink

          // Wait and check for connection
          return new Promise<string[]>((resolve, reject) => {
            let attempts = 0
            const maxAttempts = 30

            const checkConnection = () => {
              attempts++

              if (window.ethereum?.isMetaMask) {
                window.ethereum.request({ method: "eth_requestAccounts" }).then(resolve).catch(reject)
              } else if (attempts >= maxAttempts) {
                reject(new Error("MetaMask connection timeout. Please install MetaMask mobile app."))
              } else {
                setTimeout(checkConnection, 1000)
              }
            }

            setTimeout(checkConnection, 2000)
          })
        }

        const accounts = await connectToMetaMask()
        this.provider = window.ethereum

        return {
          address: accounts[0],
          provider: this.provider,
        }
      }

      // Desktop MetaMask
      if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
        this.provider = window.ethereum

        const accounts = await this.provider.request({
          method: "eth_requestAccounts",
        })

        return {
          address: accounts[0],
          provider: this.provider,
        }
      }

      throw new Error("MetaMask not found. Please install MetaMask.")
    } catch (error) {
      console.error("MetaMask connection error:", error)
      throw error
    }
  }

  async switchToFantom(): Promise<void> {
    if (!this.provider) throw new Error("Provider not initialized")

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xfa" }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xfa",
              chainName: "Fantom Opera",
              rpcUrls: ["https://rpc.ftm.tools/"],
              nativeCurrency: {
                name: "Fantom",
                symbol: "FTM",
                decimals: 18,
              },
              blockExplorerUrls: ["https://ftmscan.com"],
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }
}

// Mobile Wallet Detection Utilities
export const detectMobileWallet = () => {
  if (typeof window === "undefined") return null

  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  if (!isMobile) return null

  // Check for specific wallet apps
  if (window.ethereum?.isCoinbaseWallet) return "coinbase"
  if (window.ethereum?.isMetaMask) return "metamask"

  // Check user agent for wallet apps
  if (/CoinbaseWallet/i.test(userAgent)) return "coinbase"
  if (/MetaMask/i.test(userAgent)) return "metamask"

  return "unknown"
}

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
