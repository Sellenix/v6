import type React from "react"
import Link from "next/link"
import { HomeIcon, ShoppingCartIcon, ChartBarIcon, CogIcon } from "@heroicons/react/24/outline"

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-purple-800 text-white p-6">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-2 hover:text-purple-300 transition-colors">
              <HomeIcon className="h-6 w-6" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/builder" className="flex items-center space-x-2 hover:text-purple-300 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              <span>Website Builder</span>
            </Link>
          </li>
          <li>
            <Link href="/seo-tools" className="flex items-center space-x-2 hover:text-purple-300 transition-colors">
              <ChartBarIcon className="h-6 w-6" />
              <span>SEO Tools</span>
            </Link>
          </li>
          <li>
            <Link href="/account" className="flex items-center space-x-2 hover:text-purple-300 transition-colors">
              <CogIcon className="h-6 w-6" />
              <span>Account Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

