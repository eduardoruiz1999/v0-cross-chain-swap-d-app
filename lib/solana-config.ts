import { Connection, clusterApiUrl } from '@solana/web3.js'
import { DIAMANTE_CONFIG } from '@/config/token'

export const SOLANA_CONFIG = {
  network: 'mainnet-beta',
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('mainnet-beta'),
  commitment: 'confirmed' as const,
}

export const connection = new Connection(SOLANA_CONFIG.rpcUrl, {
  commitment: SOLANA_CONFIG.commitment,
  wsEndpoint: process.env.NEXT_PUBLIC_SOLANA_WS,
})

// Función para verificar balance de DIAMANTE
export async function getDiamanteBalance(publicKey: string) {
  try {
    // Implementación real usando getTokenAccountsByOwner
    // Debes usar @solana/spl-token
    return "0" // Placeholder
  } catch (error) {
    console.error("Error fetching DIAMANTE balance:", error)
    return "0"
  }
}
