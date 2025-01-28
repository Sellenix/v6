import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SEOData {
  score: number
  keywordDensity: number
  keywordInTitle: boolean
  keywordInMetaDescription: boolean
  technicalIssues: Array<{
    severity: "high" | "medium" | "low"
    description: string
  }>
  rankingTrend: Array<{
    date: string
    ranking: number
  }>
}

export function SEOTools() {
  const [url, setUrl] = useState("")
  const [keyword, setKeyword] = useState("")
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await axios.post<SEOData>("/api/seo/analyze", { url, keyword })
      setSeoData(response.data)
    } catch (error) {
      console.error("Error analyzing SEO:", error)
      toast({
        title: "Error",
        description: "Kon SEO-analyse niet uitvoeren. Probeer het later opnieuw.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SEO Tools</h2>
      <div className="mb-4">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Voer URL in" className="mb-2" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Voer zoekwoord in"
          className="mb-2"
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyseren..." : "Analyseer"}
        </Button>
      </div>
      {seoData && (
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{seoData.score}/100</p>
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Zoekwoord Analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Zoekwoord dichtheid: {seoData.keywordDensity}%</p>
              <p>Zoekwoord in titel: {seoData.keywordInTitle ? "Ja" : "Nee"}</p>
              <p>Zoekwoord in meta beschrijving: {seoData.keywordInMetaDescription ? "Ja" : "Nee"}</p>
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Technische SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {seoData.technicalIssues.map((issue, index) => (
                  <li key={index} className="mb-2">
                    <span className={issue.severity === "high" ? "text-red-500" : "text-yellow-500"}>
                      [{issue.severity}]
                    </span>
                    : {issue.description}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rangschikking Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seoData.rankingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ranking" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

