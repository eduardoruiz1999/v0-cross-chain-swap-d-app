import { ethers } from "ethers"

// Network configurations
export const NETWORKS = {
  FANTOM: {
    chainId: 250,
    name: "Fantom Opera",
    rpcUrl: "https://rpc.ftm.tools/",
    blockExplorer: "https://ftmscan.com",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
  },
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
}

// Contract addresses
export const CONTRACTS = {
  // JEFE Token on Fantom
  JEFE_TOKEN: "0x5b2af7fd27e2ea14945c82dd254c79d3ed34685e",

  // SpookySwap Router on Fantom
  SPOOKY_ROUTER: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  SPOOKY_FACTORY: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",

  // Multichain Bridge
  MULTICHAIN_BRIDGE: "0x6b7a87899490EcE95443e979cA9485CBE7E7152",

  // Token addresses
  USDC_FANTOM: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  USDC_ETHEREUM: "0xA0b86a33E6441b8435b662303c0f479c7e1d5b1e",
  WFTM: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

  // Uniswap V2 Router on Ethereum
  UNISWAP_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
}

// Recipient addresses
export const RECIPIENTS = ["0x3b80a92F4c4c99A4d561F289DFD307c4d5f811cD", "0x2dFB4845d9cc2DBD3CcA9bFAC34989796042d616"]

// ABI definitions
export const ABIS = {
  ERC20: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
  ],

  SPOOKY_ROUTER: [
    "function factory() external pure returns (address)",
    "function WETH() external pure returns (address)",
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)",
    "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)",
    "function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
    "function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)",
  ],

  MULTICHAIN_BRIDGE: [
    "function anySwapOut(address token, address to, uint amount, uint toChainID) external",
    "function anySwapOutUnderlying(address token, address to, uint amount, uint toChainID) external",
    "function anySwapIn(bytes32 txs, address token, address to, uint amount, uint fromChainID) external",
    "function anySwapInUnderlying(bytes32 txs, address token, address to, uint amount, uint fromChainID) external",
  ],
}

// Provider instances
export const getProvider = (chainId: number) => {
  const network = chainId === 250 ? NETWORKS.FANTOM : NETWORKS.ETHEREUM
  return new ethers.JsonRpcProvider(network.rpcUrl)
}

// Contract instances
export const getContract = (address: string, abi: string[], signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(address, abi, signerOrProvider)
}

// Helper functions
export const formatUnits = (value: bigint, decimals = 18) => {
  return ethers.formatUnits(value, decimals)
}

export const parseUnits = (value: string, decimals = 18) => {
  return ethers.parseUnits(value, decimals)
}
