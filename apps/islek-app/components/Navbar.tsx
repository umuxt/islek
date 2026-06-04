'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee, BarChart2, Settings, User } from 'lucide-react'
import { getActiveWaiter, setActiveWaiter } from '@/lib/waiter'

const NAV_LINKS = [
  { href: '/',          label: 'Cafe',      icon: Coffee },
  { href: '/analizler', label: 'Analizler', icon: BarChart2 },
  { href: '/ayarlar',   label: 'Ayarlar',   icon: Settings },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [aktifGarson, setAktifGarson] = useState<string | null>(null)

  useEffect(() => {
    const load = () => {
      setAktifGarson(getActiveWaiter())
      fetch('/api/users')
        .then((r) => r.json())
        .then((data) => {
          setTrackingEnabled(!!data.trackingEnabled)
        })
        .catch(() => {})
    }

    load()

    window.addEventListener('islek-garson-changed', load)
    return () => {
      window.removeEventListener('islek-garson-changed', load)
    }
  }, [])

  const handleDegistir = () => {
    setActiveWaiter(null)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <img src="/logo-islek.svg" alt="İşlek" style={{ height: '32px', width: 'auto' }} />
          <span className="navbar__title" style={{ display: 'none' }}>İşlek</span>
        </div>

        {/* Navbar Center: Aktif Garson */}
        {trackingEnabled && aktifGarson && (
          <div className="navbar__waiter" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text)'
          }}>
            <User size={14} className="color-accent" style={{ color: 'var(--color-accent)' }} />
            <span>{aktifGarson}</span>
            <button
              onClick={handleDegistir}
              className="btn btn-sm btn-ghost"
              style={{
                padding: '2px 8px',
                fontSize: '11px',
                minHeight: 'auto',
                height: '20px',
                color: 'var(--color-accent)',
                marginLeft: '4px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              Değiştir
            </button>
          </div>
        )}

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
                onClick={(e) => {
                  if (typeof window !== 'undefined' && (window as any).islekSettingsDirty) {
                    const confirmDiscard = window.confirm(
                      'Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?'
                    )
                    if (!confirmDiscard) {
                      e.preventDefault()
                    } else {
                      (window as any).islekSettingsDirty = false
                    }
                  }
                }}
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
