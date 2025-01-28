import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { Footer } from "./Footer"

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = localStorage.getItem("darkMode") === "true"
      setDarkMode(isDarkMode)
      document.documentElement.classList.toggle("dark", isDarkMode)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/subscriptions", label: "Abonnementen" },
    { href: "/website-builder", label: "Website Builder" },
    { href: "/seo-tools", label: "SEO Tools" },
  ]

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold font-cyberpunk text-cyberpunk-neon animate-glow">Sellenix</a>
          </Link>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`hover:text-cyberpunk-neon transition-colors ${
                    router.pathname === item.href ? "text-cyberpunk-neon" : ""
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <Sun className="text-cyberpunk-yellow" /> : <Moon className="text-cyberpunk-blue" />}
            </motion.button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout

