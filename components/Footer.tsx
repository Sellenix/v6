import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2023 Sellenix. Alle rechten voorbehouden.</p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
              <li>
                <Link href="/about" className="hover:text-cyberpunk-pink">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyberpunk-pink">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyberpunk-pink">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyberpunk-pink">
                  Gebruiksvoorwaarden
                </Link>
              </li>
              <li>
                <Link href="/reseller" className="hover:text-cyberpunk-pink">
                  Reseller Programma
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-cyberpunk-pink">
                  Affiliate Programma
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

