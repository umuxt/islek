import { getSession, setSession, deleteSession, addPaymentRecord, incrementStatsMasaCount } from '@/lib/kv'
import { bugunTarih } from '@/lib/pricing'
import type { TableSession } from '@/lib/types'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/sessions/[id]/pay
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { secilenler, yontem, tutar, masaKapatilsinMi, masaAdi, tip } = body

    const session = await getSession(id)
    if (!session) {
      return Response.json({ error: 'Oturum bulunamadı' }, { status: 404 })
    }

    // 1. Ürün adetlerini güncelle
    const guncelSiparisler = [...session.siparisler]
    let oyunUcretiOdedi = false

    for (const sec of secilenler) {
      if (sec.menuItemId === 'game-fee') {
        oyunUcretiOdedi = true
        continue
      }
      if (sec.menuItemId === 'min-difference') {
        continue
      }
      
      const idx = guncelSiparisler.findIndex((s) => s.menuItemId === sec.menuItemId)
      if (idx !== -1) {
        const item = guncelSiparisler[idx]
        const kalanAdet = item.adet - sec.adet
        if (kalanAdet <= 0) {
          guncelSiparisler.splice(idx, 1)
        } else {
          guncelSiparisler[idx] = { ...item, adet: kalanAdet }
        }
      }
    }

    session.siparisler = guncelSiparisler

    // Oyun ücreti ödemesi artık acilisZamani'ni sıfırlamıyor, çünkü kısmi ödeme (bölme) yapılabiliyor.
    // Hesaplama mantığı, toplam hesaplanan oyun ücretinden ödenenlerin çıkarılması şeklinde güncellendi.

    // 2. Ödemeyi oturuma ekle
    const odemeId = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const odemeZamani = new Date().toISOString()
    const yeniOdeme = {
      id: odemeId,
      yontem,
      tutar,
      zamani: odemeZamani,
      urunler: secilenler,
      tip: tip || 'urun_bazli',
    }

    session.odemeler = session.odemeler || []
    session.odemeler.push(yeniOdeme)

    // 3. Günlük İstatistiklere ödeme kaydını ekle
    const tarih = bugunTarih()
    await addPaymentRecord({
      id: odemeId,
      masaId: id,
      masaAdi: masaAdi || `Masa ${id}`,
      tutar,
      yontem,
      zamani: odemeZamani,
      urunler: secilenler,
    })

    // 4. Masayı kapat veya güncelle
    // Kalan ürün kalmadıysa ve masanın kapatılması talep edildiyse
    if (masaKapatilsinMi || session.siparisler.length === 0) {
      // Masayı tamamen kapat
      await deleteSession(id)
      await incrementStatsMasaCount(tarih)
      return Response.json({ ok: true, kapatildi: true })
    } else {
      // Masayı güncelle
      await setSession(session)
      return Response.json({ ok: true, kapatildi: false })
    }
  } catch (err) {
    console.error('[POST /api/sessions/[id]/pay]', err)
    return Response.json({ error: 'Ödeme alınamadı' }, { status: 500 })
  }
}
