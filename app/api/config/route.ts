import { getPricing, setPricing } from '@/lib/kv'
import type { PricingPolicy } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pricing = await getPricing()
    return Response.json(pricing)
  } catch (err) {
    console.error('[GET /api/config]', err)
    return Response.json({ error: 'Ayarlar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PricingPolicy
    await setPricing(body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/config]', err)
    return Response.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
  }
}
