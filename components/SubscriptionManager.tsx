import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Subscription {
  id: string
  package: {
    name: string
    price: number
  }
  status: string
  nextBillingDate: string
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get<Subscription[]>("/api/subscriptions")
      setSubscriptions(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Kon abonnementen niet ophalen. Probeer het later opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleUpgrade = async (subscriptionId: string) => {
    try {
      const response = await axios.post<Subscription>(`/api/subscriptions/${subscriptionId}/upgrade`)
      toast({
        title: "Succes",
        description: "Uw abonnement is succesvol geüpgraded.",
      })
      setSubscriptions(subscriptions.map((sub) => (sub.id === subscriptionId ? response.data : sub)))
    } catch (error) {
      console.error("Error upgrading subscription:", error)
      toast({
        title: "Error",
        description: "Kon abonnement niet upgraden. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
  }

  const handleDowngrade = async (subscriptionId: string) => {
    try {
      const response = await axios.post<Subscription>(`/api/subscriptions/${subscriptionId}/downgrade`)
      toast({
        title: "Succes",
        description: "Uw abonnement is succesvol gedowngraded.",
      })
      setSubscriptions(subscriptions.map((sub) => (sub.id === subscriptionId ? response.data : sub)))
    } catch (error) {
      console.error("Error downgrading subscription:", error)
      toast({
        title: "Error",
        description: "Kon abonnement niet downgraden. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = async (subscriptionId: string) => {
    try {
      await axios.post(`/api/subscriptions/${subscriptionId}/cancel`)
      toast({
        title: "Succes",
        description: "Uw abonnement is succesvol geannuleerd.",
      })
      setSubscriptions(subscriptions.filter((sub) => sub.id !== subscriptionId))
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast({
        title: "Error",
        description: "Kon abonnement niet annuleren. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Uw Abonnementen</h2>
      {subscriptions.length === 0 ? (
        <p>U heeft momenteel geen actieve abonnementen.</p>
      ) : (
        subscriptions.map((subscription) => (
          <Card key={subscription.id} className="mb-4">
            <CardHeader>
              <CardTitle>{subscription.package.name}</CardTitle>
              <CardDescription>Status: {subscription.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Prijs: €{subscription.package.price.toFixed(2)}/maand</p>
              <p>Volgende factuurdatum: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleUpgrade(subscription.id)} className="mr-2">
                Upgrade
              </Button>
              <Button onClick={() => handleDowngrade(subscription.id)} className="mr-2" variant="outline">
                Downgrade
              </Button>
              <Button onClick={() => handleCancel(subscription.id)} variant="destructive">
                Annuleer
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

