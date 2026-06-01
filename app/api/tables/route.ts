import { getTables, setTables } from '@/lib/kv'
import type { TableConfig } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tables = await getTables()
    return Response.json(tables)
  } catch (err) {
    console.error('[GET /api/tables]', err)
    return Response.json({ error: 'Masalar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as TableConfig[]
    await setTables(body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/tables]', err)
    return Response.json({ error: 'Masalar kaydedilemedi' }, { status: 500 })
  }
}
