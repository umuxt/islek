'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee, BarChart2, Settings } from 'lucide-react'

const NAV_LINKS = [
  { href: '/',          label: 'Cafe',      icon: Coffee },
  { href: '/analizler', label: 'Analizler', icon: BarChart2 },
  { href: '/ayarlar',   label: 'Ayarlar',   icon: Settings },
] as const

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <img src="/logo-islek.svg" alt="İşlek" style={{ height: '32px', width: 'auto' }} />
          <span className="navbar__title" style={{ display: 'none' }}>İşlek</span>
        </div>

        <nav className="navbar__nav" aria-label="Ana Menü">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className={`navbar__link${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="navbar__link-icon" aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}><Icon size={18} /></span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
