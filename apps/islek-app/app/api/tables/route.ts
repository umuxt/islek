import { getTables, setTables } from '@islek/db'
import type { TableConfig } from '@islek/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tables = await getTables('demo-tenant')
    return Response.json(tables)
  } catch (err) {
    console.error('[GET /api/tables]', err)
    return Response.json({ error: 'Masalar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as TableConfig[]
    await setTables('demo-tenant', body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/tables]', err)
    return Response.json({ error: 'Masalar kaydedilemedi' }, { status: 500 })
  }
}
