import type { TableSession, PricingPolicy } from '@islek/db'

/**
 * Oturum toplam tutarını ücretlendirme politikasına göre hesaplar.
 */
export function hesaplaOturumToplami(
  oturum: TableSession,
  politika: PricingPolicy
): number {
  const siparisTopLami = oturum.siparisler.reduce(
    (toplam, s) => toplam + s.fiyat * s.adet,
    0
  )

  const odenenler = oturum.odemeler || []
  let urunBazliOdenen = 0
  let tutarBazliOdenen = 0
  
  odenenler.forEach((o: any) => {
    if (o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme')) {
      tutarBazliOdenen += o.tutar
    } else {
      urunBazliOdenen += o.tutar
    }
  })

  let baseTotal = 0
  switch (politika.mod) {
    case 'siparis_bazli':
      baseTotal = siparisTopLami
      break

    case 'masa_limiti': {
      const minimum = politika.minimumHarcama ?? 0
      baseTotal = Math.max(siparisTopLami + urunBazliOdenen, minimum) - urunBazliOdenen
      break
    }

    case 'oyun_parasi': {
      let oyunUcreti = 0
      if (politika.saatlikUcretAktif) {
        const saatlikUcret = politika.saatlikUcret ?? 0
        const acilis = new Date(oturum.acilisZamani).getTime()
        const simdi = Date.now()
        const saat = (simdi - acilis) / (1000 * 60 * 60)
        const ceilSaat = Math.max(1, Math.ceil(saat))

        if (politika.kisiBasiMi) {
          oyunUcreti = ceilSaat * saatlikUcret * oturum.oyuncuSayisi
        } else {
          oyunUcreti = ceilSaat * saatlikUcret
        }
      } else {
        oyunUcreti = politika.sabitUcret ?? 0
      }

      // Kısmi ödenen oyun ücretlerini çıkar
      let oyunUcretiOdenen = 0
      odenenler.forEach((o: any) => {
        o.urunler?.forEach((u: any) => {
          if (u.menuItemId === 'game-fee') {
            oyunUcretiOdenen += u.fiyat * u.adet
          }
        })
      })

      oyunUcreti = Math.max(0, oyunUcreti - oyunUcretiOdenen)
      baseTotal = siparisTopLami + oyunUcreti
      break
    }

    default:
      baseTotal = siparisTopLami
  }

  return Math.max(0, baseTotal - tutarBazliOdenen)
}

/**
 * Oturum süresini dakika cinsinden döner.
 */
export function hesaplaSure(acilisZamani: string): number {
  const acilis = new Date(acilisZamani).getTime()
  const simdi = Date.now()
  return Math.floor((simdi - acilis) / (1000 * 60))
}

/**
 * Süreyi "2s 30dk" formatında string'e çevirir.
 */
export function formatSure(dakika: number): string {
  const s = Math.floor(dakika / 60)
  const dk = dakika % 60
  if (s === 0) return `${dk}dk`
  return `${s}s ${dk}dk`
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında döner.
 */
export function bugunTarih(): string {
  return new Date().toISOString().split('T')[0]
}
