// ─── Kategori ───────────────────────────────────────────
export interface Kategori {
  id: string
  ad: string   // display name; aynı zamanda MenuItem.kategori değeri olarak kullanılır
  icon?: string // kategori ikonu (ör. emoji)
}

// ─── Menü ───────────────────────────────────────────────
export interface MenuItem {
  id: string
  ad: string
  fiyat: number
  kategori: string  // Kategori.ad değeri; yoksa 'diğer' fallback'ı
}

// ─── Masa Konfigürasyonu ─────────────────────────────────
export interface FloorConfig {
  id: string
  ad: string
}

export interface TableConfig {
  id: string
  ad: string        // "Masa 1", "VIP 2" vb.
  x: number         // kanvas X koordinatı
  y: number         // kanvas Y koordinatı
  kapasite: number
  katId?: string
  renk?: string
}

// ─── Ücretlendirme ───────────────────────────────────────
export type UcretlendirmeModu = 'oyun_parasi' | 'masa_limiti' | 'siparis_bazli'

export interface PricingPolicy {
  mod: UcretlendirmeModu
  saatlikUcretAktif?: boolean // saatlik ücret aktif mi?
  sabitUcret?: number         // sabit oyun ücreti
  saatlikUcret?: number       // oyun_parasi modu
  kisiBasiMi?: boolean        // saatlik ücret kişi başı mı?
  minimumHarcama?: number     // masa_limiti modu
}

// ─── Oturum ──────────────────────────────────────────────
export interface Siparis {
  id: string
  menuItemId: string
  ad: string
  fiyat: number
  adet: number
  zamani: string    // ISO timestamp
}

export type MasaDurumu = 'acik' | 'hesap_istendi'

export interface TableSession {
  masaId: string
  acilisZamani: string        // ISO timestamp
  oyuncuSayisi: number
  siparisler: Siparis[]
  durum: MasaDurumu
  odemeler?: {
    id: string
    yontem: 'nakit' | 'kredi_karti' | 'iban'
    tutar: number
    zamani: string
    urunler: { menuItemId?: string; ad: string; fiyat: number; adet: number }[]
    tip?: 'urun_bazli' | 'tutar_bazli'
  }[]
}

// ─── İstatistik ──────────────────────────────────────────
export interface DailyStats {
  tarih: string               // YYYY-MM-DD
  toplamCiro: number
  masaSayisi: number
  enCokSatilanlar: { ad: string; adet: number }[]
  saatlikCiro?: Record<string, number>  // "20:00" → ciro
  nakitCiro?: number
  krediKartiCiro?: number
  ibanCiro?: number
}
