import { getMenu, setMenu } from '@islek/db'
import type { MenuItem } from '@islek/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const menu = await getMenu('demo-tenant')
    return Response.json(menu)
  } catch (err) {
    console.error('[GET /api/menu]', err)
    return Response.json({ error: 'Menü alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as MenuItem[]
    await setMenu('demo-tenant', body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/menu]', err)
    return Response.json({ error: 'Menü kaydedilemedi' }, { status: 500 })
  }
}
