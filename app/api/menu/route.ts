import { getMenu, setMenu } from '@/lib/kv'
import type { MenuItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const menu = await getMenu()
    return Response.json(menu)
  } catch (err) {
    console.error('[GET /api/menu]', err)
    return Response.json({ error: 'Menü alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as MenuItem[]
    await setMenu(body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/menu]', err)
    return Response.json({ error: 'Menü kaydedilemedi' }, { status: 500 })
  }
}
