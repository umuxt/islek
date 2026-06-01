import { Suspense } from 'react'
import MasaDetayClient from './MasaDetayClient'

export default async function MasaDetayPage({
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
        <MasaDetayClient masaId={id} />
      </Suspense>
    </main>
  )
}
