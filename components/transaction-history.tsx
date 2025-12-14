"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react"

interface Transaction {
  id: string
  type: "swap" | "bridge"
  status: "pending" | "completed" | "failed"
  amount: string
  from: string
  to: string
  timestamp: Date
  txHash?: string
}

export function TransactionHistory() {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "swap",
      status: "completed",
      amount: "1000 JEFE",
      from: "JEFE",
      to: "ETH",
      timestamp: new Date(Date.now() - 3600000),
      txHash: "0x1234...5678",
    },
    {
      id: "2",
      type: "bridge",
      status: "pending",
      amount: "500 USDC",
      from: "Fantom",
      to: "Ethereum",
      timestamp: new Date(Date.now() - 1800000),
      txHash: "0x9876...5432",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-950 text-green-300 border-green-700"
      case "pending":
        return "bg-yellow-950 text-yellow-300 border-yellow-700"
      case "failed":
        return "bg-red-950 text-red-300 border-red-700"
      default:
        return "bg-gray-950 text-gray-300 border-gray-700"
    }
  }

  return (
    <Card className="card-bg border-gray-600">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No transactions yet</div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-white font-medium capitalize">{tx.type}</span>
                </div>
                <Badge variant="secondary" className={getStatusColor(tx.status)}>
                  {tx.status}
                </Badge>
              </div>

              <div className="text-sm bright-gray">
                {tx.amount} • {tx.from} → {tx.to}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{tx.timestamp.toLocaleTimeString()}</span>
                {tx.txHash && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-400 hover:text-white">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
