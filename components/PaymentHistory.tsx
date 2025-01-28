import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Payment {
  id: string
  amount: number
  createdAt: string
  status: string
  description: string
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await axios.get<Payment[]>("/api/payments")
      setPayments(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching payment history:", error)
      toast({
        title: "Error",
        description: "Kon betalingsgeschiedenis niet ophalen. Probeer het later opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Betalingsgeschiedenis</h2>
      {payments.length === 0 ? (
        <p>Er zijn nog geen betalingen gedaan.</p>
      ) : (
        payments.map((payment) => (
          <Card key={payment.id} className="mb-4">
            <CardHeader>
              <CardTitle>€{payment.amount.toFixed(2)}</CardTitle>
              <CardDescription>Datum: {new Date(payment.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {payment.status}</p>
              <p>Beschrijving: {payment.description}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

