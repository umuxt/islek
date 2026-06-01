import { NextResponse } from 'next/server'
import { getFloors, setFloors } from '@islek/db'
import type { FloorConfig } from '@islek/db'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })

  try {
    const floors = await getFloors(tenantId)
    return Response.json(floors)
  } catch (err) {
    console.error('[GET /api/floors]', err)
    return Response.json({ error: 'Katlar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })

  try {
    const body = await request.json() as FloorConfig[]
    await setFloors(tenantId, body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/floors]', err)
    return Response.json({ error: 'Katlar kaydedilemedi' }, { status: 500 })
  }
}
