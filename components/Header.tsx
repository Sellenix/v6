"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cyberpunk-neon">
            Sellenix
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="hover:text-cyberpunk-pink">
              Dashboard
            </Link>
            <Link href="/packages" className="hover:text-cyberpunk-pink">
              Pakketten
            </Link>
            <Link href="/support" className="hover:text-cyberpunk-pink">
              Support
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="block hover:text-cyberpunk-pink">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/packages" className="block hover:text-cyberpunk-pink">
                  Pakketten
                </Link>
              </li>
              <li>
                <Link href="/support" className="block hover:text-cyberpunk-pink">
                  Support
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

