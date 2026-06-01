import { NextResponse } from 'next/server'
import { getMenu, setMenu } from '@islek/db'
import type { MenuItem } from '@islek/db'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const menu = await getMenu(tenantId)
    return Response.json(menu)
  } catch (err) {
    console.error('[GET /api/menu]', err)
    return Response.json({ error: 'Menü alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const body = await request.json() as MenuItem[]
    await setMenu(tenantId, body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/menu]', err)
    return Response.json({ error: 'Menü kaydedilemedi' }, { status: 500 })
  }
}
