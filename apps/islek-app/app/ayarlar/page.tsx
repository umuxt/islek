import { Suspense } from 'react'
import AyarlarClient from './AyarlarClient'
import LogoutButton from './LogoutButton'

export default function AyarlarPage() {
  return (
    <main className="container page-container">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Ayarlar</h1>
        </div>
        <div className="page-header__actions">
          <LogoutButton />
        </div>
      </div>
      <Suspense fallback={<div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)' }} />}>
        <AyarlarClient />
      </Suspense>
    </main>
  )
}
