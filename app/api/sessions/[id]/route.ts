import { getSession, setSession, deleteSession, incrementStatsMasaCount } from '@/lib/kv'
import { bugunTarih } from '@/lib/pricing'
import type { TableSession } from '@/lib/types'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/sessions/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession(id)
    if (!session) {
      return Response.json({ error: 'Oturum bulunamadı' }, { status: 404 })
    }
    return Response.json(session)
  } catch (err) {
    console.error('[GET /api/sessions/[id]]', err)
    return Response.json({ error: 'Oturum alınamadı' }, { status: 500 })
  }
}

// POST /api/sessions/[id] — oturum aç veya güncelle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as TableSession
    await setSession({ ...body, masaId: id })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/sessions/[id]]', err)
    return Response.json({ error: 'Oturum kaydedilemedi' }, { status: 500 })
  }
}

// DELETE /api/sessions/[id] — masayı kapat, istatistiğe ekle
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession(id)

    if (session) {
      const tarih = bugunTarih()
      await incrementStatsMasaCount(tarih)
    }

    await deleteSession(id)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/sessions/[id]]', err)
    return Response.json({ error: 'Masa kapatılamadı' }, { status: 500 })
  }
}
