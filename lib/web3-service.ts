import type { ethers } from "ethers"
import { CONTRACTS, ABIS, getProvider, getContract, formatUnits, parseUnits, NETWORKS } from "./contracts"

export class Web3Service {
  private static fantomProvider = getProvider(250)
  private static ethereumProvider = getProvider(1)

  // Get token balance
  static async getTokenBalance(tokenAddress: string, walletAddress: string, chainId = 250): Promise<string> {
    try {
      const provider = chainId === 250 ? this.fantomProvider : this.ethereumProvider
      const tokenContract = getContract(tokenAddress, ABIS.ERC20, provider)

      const balance = await tokenContract.balanceOf(walletAddress)
      const decimals = await tokenContract.decimals()

      return formatUnits(balance, decimals)
    } catch (error) {
      console.error("Error getting token balance:", error)
      return "0"
    }
  }

  // Get ETH/FTM balance
  static async getNativeBalance(walletAddress: string, chainId = 250): Promise<string> {
    try {
      const provider = chainId === 250 ? this.fantomProvider : this.ethereumProvider
      const balance = await provider.getBalance(walletAddress)

      return formatUnits(balance, 18)
    } catch (error) {
      console.error("Error getting native balance:", error)
      return "0"
    }
  }

  // Get swap quote from SpookySwap
  static async getSwapQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    signer: ethers.Signer,
  ): Promise<{ amountOut: string; path: string[] }> {
    try {
      const routerContract = getContract(CONTRACTS.SPOOKY_ROUTER, ABIS.SPOOKY_ROUTER, signer)

      // Create path for swap
      const path = [tokenIn, tokenOut]

      // If not direct pair, route through WFTM or USDC
      if (tokenIn !== CONTRACTS.WFTM && tokenOut !== CONTRACTS.WFTM) {
        if (tokenIn === CONTRACTS.JEFE_TOKEN) {
          path.splice(1, 0, CONTRACTS.USDC_FANTOM) // JEFE -> USDC -> tokenOut
        } else {
          path.splice(1, 0, CONTRACTS.WFTM) // tokenIn -> WFTM -> tokenOut
        }
      }

      const amountInWei = parseUnits(amountIn, 18)
      const amounts = await routerContract.getAmountsOut(amountInWei, path)

      const amountOut = formatUnits(amounts[amounts.length - 1], 18)

      return { amountOut, path }
    } catch (error) {
      console.error("Error getting swap quote:", error)
      throw new Error("Failed to get swap quote")
    }
  }

  // Execute swap on SpookySwap
  static async executeSwap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    amountOutMin: string,
    recipient: string,
    signer: ethers.Signer,
  ): Promise<string> {
    try {
      const routerContract = getContract(CONTRACTS.SPOOKY_ROUTER, ABIS.SPOOKY_ROUTER, signer)

      // Get swap path
      const { path } = await this.getSwapQuote(tokenIn, tokenOut, amountIn, signer)

      // Approve token spending if needed
      if (tokenIn !== CONTRACTS.WFTM) {
        await this.approveToken(tokenIn, CONTRACTS.SPOOKY_ROUTER, amountIn, signer)
      }

      const amountInWei = parseUnits(amountIn, 18)
      const amountOutMinWei = parseUnits(amountOutMin, 18)
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

      let tx
      if (tokenIn === CONTRACTS.WFTM) {
        // Swap FTM for tokens
        tx = await routerContract.swapExactETHForTokens(amountOutMinWei, path, recipient, deadline, {
          value: amountInWei,
        })
      } else if (tokenOut === CONTRACTS.WFTM) {
        // Swap tokens for FTM
        tx = await routerContract.swapExactTokensForETH(amountInWei, amountOutMinWei, path, recipient, deadline)
      } else {
        // Swap tokens for tokens
        tx = await routerContract.swapExactTokensForTokens(amountInWei, amountOutMinWei, path, recipient, deadline)
      }

      return tx.hash
    } catch (error) {
      console.error("Error executing swap:", error)
      throw new Error("Failed to execute swap")
    }
  }

  // Approve token spending
  static async approveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    signer: ethers.Signer,
  ): Promise<string> {
    try {
      const tokenContract = getContract(tokenAddress, ABIS.ERC20, signer)
      const amountWei = parseUnits(amount, 18)

      const tx = await tokenContract.approve(spenderAddress, amountWei)
      await tx.wait()

      return tx.hash
    } catch (error) {
      console.error("Error approving token:", error)
      throw new Error("Failed to approve token")
    }
  }

  // Check token allowance
  static async getTokenAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    signer: ethers.Signer,
  ): Promise<string> {
    try {
      const tokenContract = getContract(tokenAddress, ABIS.ERC20, signer)
      const allowance = await tokenContract.allowance(ownerAddress, spenderAddress)

      return formatUnits(allowance, 18)
    } catch (error) {
      console.error("Error getting token allowance:", error)
      return "0"
    }
  }

  // Bridge tokens using Multichain
  static async bridgeTokens(
    tokenAddress: string,
    recipient: string,
    amount: string,
    toChainId: number,
    signer: ethers.Signer,
  ): Promise<string> {
    try {
      const bridgeContract = getContract(CONTRACTS.MULTICHAIN_BRIDGE, ABIS.MULTICHAIN_BRIDGE, signer)

      // Approve token spending for bridge
      await this.approveToken(tokenAddress, CONTRACTS.MULTICHAIN_BRIDGE, amount, signer)

      const amountWei = parseUnits(amount, 18)

      const tx = await bridgeContract.anySwapOut(tokenAddress, recipient, amountWei, toChainId)

      return tx.hash
    } catch (error) {
      console.error("Error bridging tokens:", error)
      throw new Error("Failed to bridge tokens")
    }
  }

  // Get current gas price
  static async getGasPrice(chainId = 250): Promise<string> {
    try {
      const provider = chainId === 250 ? this.fantomProvider : this.ethereumProvider
      const gasPrice = await provider.getFeeData()

      return formatUnits(gasPrice.gasPrice || 0n, 9) // Convert to Gwei
    } catch (error) {
      console.error("Error getting gas price:", error)
      return "0"
    }
  }

  // Estimate gas for transaction
  static async estimateGas(contract: ethers.Contract, method: string, params: any[]): Promise<bigint> {
    try {
      return await contract[method].estimateGas(...params)
    } catch (error) {
      console.error("Error estimating gas:", error)
      return 21000n // Default gas limit
    }
  }

  // Switch network in MetaMask
  static async switchNetwork(chainId: number): Promise<void> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not available")
    }

    const network = chainId === 250 ? NETWORKS.FANTOM : NETWORKS.ETHEREUM

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          })
        } catch (addError) {
          throw new Error("Failed to add network to MetaMask")
        }
      } else {
        throw new Error("Failed to switch network")
      }
    }
  }
}
