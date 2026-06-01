import { NextRequest } from 'next/server'
import { getSession, setSession, deleteSession, getAllSessions } from '@islek/db'
import type { TableSession } from '@islek/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sourceMasaId } = await params
    const body = await request.json()
    const { targetMasaId } = body

    if (!targetMasaId) {
      console.log('400: !targetMasaId', body)
      return Response.json({ error: 'Hedef masa ID belirtilmedi' }, { status: 400 })
    }

    if (sourceMasaId === targetMasaId) {
      console.log('400: source === target')
      return Response.json({ error: 'Kaynak ve hedef masa aynı olamaz' }, { status: 400 })
    }

    // Hedef masa dolu mu? (UI ile aynı mantıkta kontrol etmek için getAllSessions kullanalım, zombie session kalmış olabilir)
    const activeSessions = await getAllSessions('demo-tenant')
    const targetIsActive = activeSessions.some(s => s.masaId === targetMasaId)
    if (targetIsActive) {
      console.log('400: targetSession exists in activeSessions')
      return Response.json({ error: 'Hedef masa şu anda dolu. Lütfen boş bir masa seçin.' }, { status: 400 })
    }

    // Kaynak masa oturumunu al
    const sourceSession = await getSession('demo-tenant', sourceMasaId)
    if (!sourceSession) {
      return Response.json({ error: 'Kaynak masa boş veya bulunamadı' }, { status: 404 })
    }

    // Yeni oturumu oluştur
    const newSession: TableSession = {
      ...sourceSession,
      masaId: targetMasaId
    }

    // Yeni masaya kaydet
    await setSession('demo-tenant', newSession)

    // Eski masayı sil
    await deleteSession('demo-tenant', sourceMasaId)

    return Response.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/[id]/transfer]`, err)
    return Response.json({ error: 'Masa aktarılırken bir hata oluştu' }, { status: 500 })
  }
}
