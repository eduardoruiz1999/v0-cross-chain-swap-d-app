"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Gem } from "lucide-react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo } from "@solana/web3.js"
import { FC, useEffect, useState } from "react"

// Define una interfaz basada en los datos reales de Solana
interface SolanaTransaction {
  signature: string
  slot: number
  status: 'success' | 'failed' // Basado en `meta.err`
  blockTime: number | null | undefined
  // Puedes expandir esto con más detalles de `ParsedTransactionWithMeta` según sea necesario
  mainAction?: string // Ej: "Token Swap", "Transfer", etc. (requiere análisis de instrucciones)
}

export const TransactionHistory: FC = () => {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [transactions, setTransactions] = useState<SolanaTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener y procesar transacciones
  const fetchTransactions = async () => {
    if (!publicKey || !connected) {
      setTransactions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Obtener firmas de transacciones para la dirección (wallet del usuario)
      // La función getSignaturesForAddress obtiene una lista de transacciones
      const signatures: ConfirmedSignatureInfo[] = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 10 } // Limitar a las 10 transacciones más recientes
      )

      if (signatures.length === 0) {
        setTransactions([])
        setIsLoading(false)
        return
      }

      // 2. Obtener los detalles completos de cada transacción usando las firmas
      // Esta llamada es más informativa que getTransaction[citation:7]
      const transactionDetails = await connection.getParsedTransactions(
        signatures.map(sig => sig.signature),
        { maxSupportedTransactionVersion: 0 }
      )

      // 3. Mapear los datos de Solana a nuestro formato interno
      const formattedTxs: SolanaTransaction[] = transactionDetails
        .filter((tx): tx is ParsedTransactionWithMeta => tx !== null) // Filtrar nulos
        .map(tx => {
          // Intentar determinar una acción principal (simplificado)
          let mainAction = "Transaction"
          const firstProgram = tx.transaction.message.instructions[0]?.programId?.toString()
          // Aquí puedes añadir lógica para detectar swaps, transfers, etc., basándote en los program IDs.
          if (firstProgram?.includes('Token')) mainAction = "Token Transfer"

          return {
            signature: tx.transaction.signatures[0], // Tomar la firma principal
            slot: tx.slot,
            status: tx.meta?.err ? 'failed' : 'success',
            blockTime: tx.blockTime,
            mainAction: mainAction
          }
        })

      setTransactions(formattedTxs)

    } catch (err: any) {
      console.error("Failed to fetch transactions:", err)
      setError("Could not load transaction history. Please try again.")
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Efecto para cargar transacciones cuando se conecta la wallet
  useEffect(() => {
    fetchTransactions()
  }, [publicKey, connected]) // Se vuelve a ejecutar si la wallet conectada cambia

  const getStatusIcon = (status: 'success' | 'failed') => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: 'success' | 'failed') => {
    switch (status) {
      case "success":
        return "bg-green-950 text-green-300 border-green-700"
      case "failed":
        return "bg-red-950 text-red-300 border-red-700"
      default:
        return "bg-gray-950 text-gray-300 border-gray-700"
    }
  }

  // Función para formatear la marca de tiempo (timestamp)
  const formatTime = (blockTime: number | null | undefined) => {
    if (!blockTime) return 'N/A'
    return new Date(blockTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="card-bg border-gray-600">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-white text-lg">Recent Transactions</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTransactions}
          disabled={isLoading || !connected}
          className="h-8 text-cyan-400 hover:text-cyan-300"
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center text-gray-400 py-6">
            <Wallet className="h-8 w-8 mx-auto mb-2" />
            <p>Connect your wallet to view transaction history.</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mx-auto" />
            <p className="text-gray-400 mt-2">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-300 py-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={fetchTransactions} className="mt-2">
              Retry
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            <Gem className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent transactions found for DIAMANTE.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.signature} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 space-y-2 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-white font-medium text-sm">
                    {tx.mainAction || "Solana Transaction"}
                  </span>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(tx.status)} text-xs`}>
                  {tx.status === 'success' ? 'Confirmed' : 'Failed'}
                </Badge>
              </div>

              <div className="text-xs bright-gray font-mono truncate">
                Sig: {tx.signature.slice(0, 12)}...{tx.signature.slice(-8)}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Slot: {tx.slot.toLocaleString()}</span>
                  <span>•</span>
                  <span>{formatTime(tx.blockTime)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-gray-400 hover:text-cyan-300"
                  asChild
                >
                  {/* Enlace al explorador de Solana */}
                  <a
                    href={`https://solscan.io/tx/${tx.signature}?cluster=mainnet-beta`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Solscan"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          ))
        )}

        {connected && transactions.length > 0 && (
          <div className="text-center pt-2">
            <Button
              variant="link"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 text-xs"
              asChild
            >
              <a
                href={`https://solscan.io/account/${publicKey?.toString()}?cluster=mainnet-beta`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View full history on Solscan
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
