import { Suspense } from 'react'
import HesapKapatClient from './HesapKapatClient'

export default async function HesapKapatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main>
      <Suspense fallback={
        <div className="container" style={{ padding: 'var(--space-8) 0' }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)' }} />
        </div>
      }>
        <HesapKapatClient masaId={id} />
      </Suspense>
    </main>
  )
}
