'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      router.replace('/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => setShowConfirm(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <LogOut size={16} />
        Çıkış Yap
      </button>

      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoggingOut) {
              setShowConfirm(false)
            }
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-active)' }}>
              <AlertTriangle size={48} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                Çıkış yapmak istiyor musunuz?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Oturumunuz kapatılacak. Kayıtlı masa, menü, kategori ve hesap verileri silinmez.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowConfirm(false)}
                disabled={isLoggingOut}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ flex: 1, background: 'var(--color-active)', color: '#fff' }}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
