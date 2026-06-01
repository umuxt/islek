import { NextRequest } from 'next/server'
import Redis from 'ioredis'
import { bugunTarih } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || bugunTarih()

    const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
    const redis = new Redis(url, { lazyConnect: false })
    
    const paymentsKey = `stats:payments:${date}`
    const raws = await redis.lrange(paymentsKey, 0, -1)
    
    let nakit = 0
    let krediKarti = 0
    let iban = 0
    let toplamCiro = 0
    
    const urunler: Record<string, { adet: number; tutar: number }> = {}
    const islemler: any[] = []

    for (const raw of raws) {
      try {
        const p = JSON.parse(raw)
        islemler.push(p)
        
        const tutar = Number(p.tutar) || 0
        toplamCiro += tutar
        
        if (p.yontem === 'nakit') nakit += tutar
        else if (p.yontem === 'kredi_karti') krediKarti += tutar
        else if (p.yontem === 'iban') iban += tutar
        
        if (Array.isArray(p.urunler)) {
          for (const u of p.urunler) {
            // Tutar bazlı veya özel bir isimlendirme olabilir, item bazında topla
            const ad = u.ad || 'Bilinmeyen Ürün'
            const adet = Number(u.adet) || 1
            const fiyat = Number(u.fiyat) || 0
            const satirTutari = fiyat * adet
            
            if (!urunler[ad]) {
              urunler[ad] = { adet: 0, tutar: 0 }
            }
            urunler[ad].adet += adet
            urunler[ad].tutar += satirTutari
          }
        }
      } catch (e) {
        // invalid json, skip
      }
    }
    
    redis.disconnect()

    const urunListesi = Object.entries(urunler)
      .map(([ad, data]) => ({ ad, adet: data.adet, tutar: data.tutar }))
      .sort((a, b) => b.tutar - a.tutar) // En çok ciro getirene göre sırala
      
    // İşlemleri en yeniden eskiye sırala
    islemler.sort((a, b) => new Date(b.zamani).getTime() - new Date(a.zamani).getTime())

    return Response.json({
      tarih: date,
      ozet: {
        toplamCiro,
        nakit,
        krediKarti,
        iban
      },
      urunler: urunListesi,
      islemler
    })
  } catch (error) {
    console.error('[GET /api/stats/end-of-day]', error)
    return Response.json({ error: 'Gün sonu raporu alınamadı' }, { status: 500 })
  }
}
