import { NextResponse } from 'next/server'
import { getPricing, setPricing } from '@islek/db'
import type { PricingPolicy } from '@islek/db'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const pricing = await getPricing(tenantId)
    return Response.json(pricing)
  } catch (err) {
    console.error('[GET /api/config]', err)
    return Response.json({ error: 'Ayarlar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const body = await request.json() as PricingPolicy
    await setPricing(tenantId, body)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/config]', err)
    return Response.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
  }
}
