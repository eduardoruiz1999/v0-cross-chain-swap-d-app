// API Service Functions
export class PriceService {
  static async fetchCoinGeckoPrice(): Promise<number> {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=jefe-finance&vs_currencies=usd")
      const data = await response.json()
      return data["jefe-finance"]?.usd || 0
    } catch (error) {
      console.error("CoinGecko API error:", error)
      return 0
    }
  }

  static async fetchSpookyPrice(): Promise<number> {
    try {
      // Mock SpookySwap API call
      const response = await fetch("https://api.spooky.fi/api/v2/prices/jefe-finance")
      const data = await response.json()
      return data.price || 0
    } catch (error) {
      console.error("SpookySwap API error:", error)
      return 0
    }
  }

  static async fetchCoinbasePrice(): Promise<number> {
    try {
      // Mock Coinbase API call
      const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=JEFE")
      const data = await response.json()
      return Number.parseFloat(data.data?.rates?.USD || "0")
    } catch (error) {
      console.error("Coinbase API error:", error)
      return 0
    }
  }
}

export class Web3Service {
  static async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    // Mock implementation - in real app, use ethers.js
    return (Math.random() * 10000).toFixed(2)
  }

  static async getEthBalance(walletAddress: string): Promise<string> {
    // Mock implementation
    return (Math.random() * 10).toFixed(4)
  }

  static async executeSwap(params: any): Promise<string> {
    // Mock swap execution
    return "0x" + Math.random().toString(16).substr(2, 64)
  }
}
