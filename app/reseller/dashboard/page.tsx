"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function ResellerDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/reseller/dashboard")
        setData(response.data)
      } catch (error) {
        console.error("Error fetching reseller data:", error)
      }
    }

    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Reseller Dashboard</h1>
      {/* Render your reseller dashboard data here */}
    </div>
  )
}

