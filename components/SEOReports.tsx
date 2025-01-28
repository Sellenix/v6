import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface SEOReport {
  id: string
  website: {
    id: string
    name: string
  }
  createdAt: string
  score: number
  summary: string
}

export function SEOReports() {
  const [reports, setReports] = useState<SEOReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await axios.get<SEOReport[]>("/api/seo-reports")
      setReports(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching SEO reports:", error)
      toast({
        title: "Error",
        description: "Kon SEO-rapporten niet ophalen. Probeer het later opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleGenerateReport = async (websiteId: string) => {
    try {
      await axios.post(`/api/seo-reports/generate/${websiteId}`)
      toast({
        title: "Succes",
        description: "SEO-rapport wordt gegenereerd. Dit kan enkele minuten duren.",
      })
      fetchReports()
    } catch (error) {
      console.error("Error generating SEO report:", error)
      toast({
        title: "Error",
        description: "Kon SEO-rapport niet genereren. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SEO Rapporten</h2>
      {reports.length === 0 ? (
        <p>Er zijn nog geen SEO-rapporten gegenereerd.</p>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="mb-4">
            <CardHeader>
              <CardTitle>{report.website.name}</CardTitle>
              <CardDescription>Gegenereerd op: {new Date(report.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Score: {report.score}/100</p>
              <p>Belangrijkste bevindingen: {report.summary}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleGenerateReport(report.website.id)}>Nieuw rapport genereren</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

