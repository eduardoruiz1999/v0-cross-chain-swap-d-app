export class PriceService {
  private static ethPrice = 0
  private static jefeEthParity = 1 // 1 JEFE = 1 ETH

  // Fetch ETH price from multiple sources
  static async fetchETHPrice(): Promise<number> {
    try {
      const sources = [this.fetchCoinGeckoETH(), this.fetchCoinbaseETH(), this.fetchBinanceETH()]

      const results = await Promise.allSettled(sources)
      const prices: number[] = []

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value > 0) {
          prices.push(result.value)
        }
      })

      if (prices.length === 0) {
        throw new Error("No price sources available")
      }

      // Calculate average price
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      this.ethPrice = avgPrice

      return avgPrice
    } catch (error) {
      console.error("Error fetching ETH price:", error)
      // Fallback to cached price or default
      return this.ethPrice || 3000
    }
  }

  private static async fetchCoinGeckoETH(): Promise<number> {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    const data = await response.json()
    return data.ethereum?.usd || 0
  }

  private static async fetchCoinbaseETH(): Promise<number> {
    const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH")
    const data = await response.json()
    return Number.parseFloat(data.data?.rates?.USD || "0")
  }

  private static async fetchBinanceETH(): Promise<number> {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
    const data = await response.json()
    return Number.parseFloat(data.price || "0")
  }

  // Get JEFE price in parity with ETH
  static async getJEFEPrice(): Promise<{
    usd: number
    eth: number
    parity: boolean
  }> {
    try {
      const ethPrice = await this.fetchETHPrice()

      // JEFE price equals ETH price (1:1 parity)
      const jefeUsdPrice = ethPrice * this.jefeEthParity

      return {
        usd: jefeUsdPrice,
        eth: this.jefeEthParity,
        parity: true,
      }
    } catch (error) {
      console.error("Error calculating JEFE price:", error)
      return {
        usd: 3000, // Fallback
        eth: 1,
        parity: true,
      }
    }
  }

  // Get real-time prices for display
  static async getAllPrices(): Promise<{
    jefe: { usd: number; eth: number }
    eth: { usd: number }
    sources: {
      coingecko: number
      coinbase: number
      binance: number
    }
  }> {
    try {
      const [jefePrice, ethPrice] = await Promise.all([this.getJEFEPrice(), this.fetchETHPrice()])

      // Get prices from different sources for comparison
      const [coingecko, coinbase, binance] = await Promise.allSettled([
        this.fetchCoinGeckoETH(),
        this.fetchCoinbaseETH(),
        this.fetchBinanceETH(),
      ])

      return {
        jefe: {
          usd: jefePrice.usd,
          eth: jefePrice.eth,
        },
        eth: {
          usd: ethPrice,
        },
        sources: {
          coingecko: coingecko.status === "fulfilled" ? coingecko.value : 0,
          coinbase: coinbase.status === "fulfilled" ? coinbase.value : 0,
          binance: binance.status === "fulfilled" ? binance.value : 0,
        },
      }
    } catch (error) {
      console.error("Error fetching all prices:", error)
      throw error
    }
  }

  // Set custom JEFE/ETH parity ratio
  static setJEFEParity(ratio: number): void {
    this.jefeEthParity = ratio
  }

  // Get current parity ratio
  static getJEFEParity(): number {
    return this.jefeEthParity
  }
}
