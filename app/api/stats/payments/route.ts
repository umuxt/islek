import { NextRequest } from 'next/server'
import { getPaginatedPayments } from '@/lib/kv'
import { bugunTarih } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const date = searchParams.get('date') || bugunTarih()
    const pageStr = searchParams.get('page') || '1'
    const limitStr = searchParams.get('limit') || '20'
    
    const page = Math.max(1, parseInt(pageStr, 10) || 1)
    const limit = Math.max(1, parseInt(limitStr, 10) || 20)
    
    const result = await getPaginatedPayments(date, page, limit)
    
    return Response.json(result)
  } catch (error) {
    console.error('[GET /api/stats/payments]', error)
    return Response.json({ error: 'Ödemeler alınamadı' }, { status: 500 })
  }
}
