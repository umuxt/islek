import { NextRequest, NextResponse } from 'next/server'
import { getPaymentsList } from '@islek/db'
import { bugunTarih } from '@/lib/pricing'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || bugunTarih()

    const payments = await getPaymentsList(tenantId, date)
    
    let nakit = 0
    let krediKarti = 0
    let iban = 0
    let toplamCiro = 0
    
    const urunler: Record<string, { adet: number; tutar: number }> = {}
    const islemler: any[] = []

    for (const p of payments) {
      if (!p) continue
      islemler.push(p)
      
      const tutar = Number(p.tutar) || 0
      toplamCiro += tutar
      
      if (p.yontem === 'nakit') nakit += tutar
      else if (p.yontem === 'kredi_karti') krediKarti += tutar
      else if (p.yontem === 'iban') iban += tutar
      
      if (Array.isArray(p.urunler)) {
        for (const u of p.urunler) {
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
    }

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
