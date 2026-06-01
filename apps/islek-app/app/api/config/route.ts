import { getPricing, setPricing } from '@islek/db'
import type { PricingPolicy } from '@islek/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pricing = await getPricing('demo-tenant')
    return Response.json(pricing)
  } catch (err) {
    console.error('[GET /api/config]', err)
    return Response.json({ error: 'Ayarlar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PricingPolicy
    await setPricing('demo-tenant', body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/config]', err)
    return Response.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
  }
}
