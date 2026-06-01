import { NextResponse } from 'next/server'
import { getTables, setTables } from '@islek/db'
import type { TableConfig } from '@islek/db'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const tables = await getTables(tenantId)
    return Response.json(tables)
  } catch (err) {
    console.error('[GET /api/tables]', err)
    return Response.json({ error: 'Masalar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const body = await request.json() as TableConfig[]
    await setTables(tenantId, body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/tables]', err)
    return Response.json({ error: 'Masalar kaydedilemedi' }, { status: 500 })
  }
}
