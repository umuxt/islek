import { getDailyStats, getRecentStats } from '@islek/db'
import { NextRequest, NextResponse } from 'next/server'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

// GET /api/stats?tarih=YYYY-MM-DD  → tek günün istatistiği
// GET /api/stats?gun=30            → son 30 günün istatistikleri
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const { searchParams } = request.nextUrl
    const tarih = searchParams.get('tarih')
    const gun = searchParams.get('gun')

    if (tarih) {
      const stat = await getDailyStats(tenantId, tarih)
      return Response.json(stat ?? null)
    }

    const gunSayisi = gun ? parseInt(gun, 10) : 30
    const stats = await getRecentStats(tenantId, gunSayisi)
    return Response.json(stats)
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return Response.json({ error: 'İstatistikler alınamadı' }, { status: 500 })
  }
}
