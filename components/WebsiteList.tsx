import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Website {
  id: string
  name: string
  isPublished: boolean
  domain: string
  updatedAt: string
}

export function WebsiteList() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const response = await axios.get<Website[]>("/api/websites")
      setWebsites(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching websites:", error)
      toast({
        title: "Error",
        description: "Kon websites niet ophalen. Probeer het later opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handlePublish = async (websiteId: string) => {
    try {
      await axios.post(`/api/websites/${websiteId}/publish`)
      toast({
        title: "Succes",
        description: "Website succesvol gepubliceerd.",
      })
      fetchWebsites()
    } catch (error) {
      console.error("Error publishing website:", error)
      toast({
        title: "Error",
        description: "Kon website niet publiceren. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Uw Websites</h2>
      {websites.length === 0 ? (
        <p>U heeft nog geen websites gemaakt.</p>
      ) : (
        websites.map((website) => (
          <Card key={website.id} className="mb-4">
            <CardHeader>
              <CardTitle>{website.name}</CardTitle>
              <CardDescription>Status: {website.isPublished ? "Gepubliceerd" : "Concept"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Domein: {website.domain}</p>
              <p>Laatst bijgewerkt: {new Date(website.updatedAt).toLocaleString()}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handlePublish(website.id)} disabled={website.isPublished}>
                {website.isPublished ? "Gepubliceerd" : "Publiceren"}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

