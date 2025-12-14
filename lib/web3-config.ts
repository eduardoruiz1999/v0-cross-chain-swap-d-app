// Web3 Configuration Constants
export const NETWORKS = {
  FANTOM: {
    chainId: 250,
    name: "Fantom Opera",
    rpcUrl: "https://rpc.ftm.tools/",
    blockExplorer: "https://ftmscan.com",
  },
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_KEY",
    blockExplorer: "https://etherscan.io",
  },
}

export const CONTRACTS = {
  JEFE_TOKEN: "0x5b2af7fd27e2ea14945c82dd254c79d3ed34685e",
  SPOOKY_ROUTER: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  MULTICHAIN_BRIDGE: "0x6b7a87899490EcE95443e979cA9485CBE7E7152",
  USDC_FANTOM: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  USDC_ETHEREUM: "0xA0b86a33E6441b8435b662303c0f479c7e1d5b1e",
}

export const RECIPIENTS = ["0x3b80a92F4c4c99A4d561F289DFD307c4d5f811cD", "0x2dFB4845d9cc2DBD3CcA9bFAC34989796042d616"]

export const BRIDGE_TIMES = {
  multichain: "15-30 min",
  spiritbridge: "5-15 min",
}
