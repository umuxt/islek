import { getDailyStats, getRecentStats } from '@/lib/kv'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/stats?tarih=YYYY-MM-DD  → tek günün istatistiği
// GET /api/stats?gun=30            → son 30 günün istatistikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const tarih = searchParams.get('tarih')
    const gun = searchParams.get('gun')

    if (tarih) {
      const stat = await getDailyStats(tarih)
      return Response.json(stat ?? null)
    }

    const gunSayisi = gun ? parseInt(gun, 10) : 30
    const stats = await getRecentStats(gunSayisi)
    return Response.json(stats)
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return Response.json({ error: 'İstatistikler alınamadı' }, { status: 500 })
  }
}
