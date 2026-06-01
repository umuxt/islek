import Redis from 'ioredis'
import type {
  MenuItem,
  TableConfig,
  PricingPolicy,
  TableSession,
  DailyStats,
  Kategori,
} from './types'

// ─── Redis istemcisi ─────────────────────────────────────
// Local:      REDIS_URL=redis://localhost:6379  (Docker)
// Production: REDIS_URL=rediss://:TOKEN@HOST:PORT  (Upstash standard)
// Env var yoksa localhost:6379'a bağlanmayı dener.

let _redis: Redis | null = null

function getRedis(): Redis {
  if (_redis) return _redis

  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  _redis = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 2 })
  return _redis
}

// ─── JSON yardımcıları ───────────────────────────────────
async function kvGet<T>(key: string): Promise<T | null> {
  const raw = await getRedis().get(key)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  await getRedis().set(key, JSON.stringify(value))
}

// ─── Redis Key Sabitleri ─────────────────────────────────
export const KEYS = {
  menu: 'config:menu',
  categories: 'config:categories',
  tables: 'config:tables',
  pricing: 'config:pricing',
  activeSessions: 'session:active',
  session: (id: string) => `session:table:${id}`,
  dailyStats: (date: string) => `stats:daily:${date}`,
} as const

// ─── Menü ────────────────────────────────────────────────
export async function getMenu(): Promise<MenuItem[]> {
  return (await kvGet<MenuItem[]>(KEYS.menu)) ?? []
}

export async function setMenu(menu: MenuItem[]): Promise<void> {
  await kvSet(KEYS.menu, menu)
}

// ─── Kategoriler ─────────────────────────────────────────
export async function getCategories(): Promise<Kategori[]> {
  return (await kvGet<Kategori[]>(KEYS.categories)) ?? []
}

export async function setCategories(categories: Kategori[]): Promise<void> {
  await kvSet(KEYS.categories, categories)
}

// ─── Masa Konfigürasyonu ─────────────────────────────────
export async function getTables(): Promise<TableConfig[]> {
  return (await kvGet<TableConfig[]>(KEYS.tables)) ?? []
}

export async function setTables(tables: TableConfig[]): Promise<void> {
  await kvSet(KEYS.tables, tables)
}

// ─── Ücretlendirme ───────────────────────────────────────
const DEFAULT_PRICING: PricingPolicy = { mod: 'siparis_bazli' }

export async function getPricing(): Promise<PricingPolicy> {
  return (await kvGet<PricingPolicy>(KEYS.pricing)) ?? DEFAULT_PRICING
}

export async function setPricing(policy: PricingPolicy): Promise<void> {
  await kvSet(KEYS.pricing, policy)
}

// ─── Oturumlar ───────────────────────────────────────────
export async function getSession(masaId: string): Promise<TableSession | null> {
  return kvGet<TableSession>(KEYS.session(masaId))
}

export async function getAllSessions(): Promise<TableSession[]> {
  const redis = getRedis()
  const activeIds = await redis.smembers(KEYS.activeSessions)
  if (activeIds.length === 0) return []
  
  const keys = activeIds.map(id => KEYS.session(id))
  const raws = await redis.mget(...keys)
  
  return raws
    .map((r) => { try { return r ? JSON.parse(r) as TableSession : null } catch { return null } })
    .filter((s): s is TableSession => s !== null)
}

export async function setSession(session: TableSession): Promise<void> {
  const redis = getRedis()
  await Promise.all([
    redis.set(KEYS.session(session.masaId), JSON.stringify(session)),
    redis.sadd(KEYS.activeSessions, session.masaId)
  ])
}

export async function deleteSession(masaId: string): Promise<void> {
  const redis = getRedis()
  await Promise.all([
    redis.del(KEYS.session(masaId)),
    redis.srem(KEYS.activeSessions, masaId)
  ])
}

// ─── İstatistikler ───────────────────────────────────────
export async function getDailyStats(tarih: string): Promise<DailyStats | null> {
  return kvGet<DailyStats>(KEYS.dailyStats(tarih))
}


export async function getRecentStats(gunSayisi = 30): Promise<DailyStats[]> {
  const bugun = new Date()
  const keys: string[] = []
  
  for (let i = 0; i < gunSayisi; i++) {
    const tarih = new Date(bugun)
    tarih.setDate(bugun.getDate() - i)
    keys.push(KEYS.dailyStats(tarih.toISOString().split('T')[0]))
  }
  
  const redis = getRedis()
  const raws = await redis.mget(...keys)
  
  const sonuclar: DailyStats[] = []
  raws.forEach((r) => {
    if (r) {
      try { sonuclar.push(JSON.parse(r) as DailyStats) } catch {}
    }
  })
  
  return sonuclar.sort((a, b) => a.tarih.localeCompare(b.tarih))
}

// ─── Ödeme Kayıt & İstatistik ─────────────────────────────
export async function addPaymentRecord(record: {
  id: string
  masaId: string
  masaAdi: string
  tutar: number
  yontem: 'nakit' | 'kredi_karti' | 'iban'
  zamani: string
  urunler: { menuItemId?: string; ad: string; fiyat: number; adet: number }[]
}): Promise<void> {
  const redis = getRedis()
  const bugun = record.zamani.split('T')[0]

  // Detaylı ödeme kaydını günlük listeye de ekle (günlük analizler için)
  const paymentsKey = `stats:payments:${bugun}`
  await redis.rpush(paymentsKey, JSON.stringify(record))

  // DailyStats güncelle
  const statsKey = KEYS.dailyStats(bugun)
  const mevcut = await getDailyStats(bugun)

  const siparisMap: Record<string, number> = {}
  for (const u of record.urunler) {
    if (u.menuItemId) { // Sanal kalemleri en çok satılanlar listesine ekleme
      siparisMap[u.ad] = (siparisMap[u.ad] ?? 0) + u.adet
    }
  }

  if (!mevcut) {
    await kvSet(statsKey, {
      tarih: bugun,
      toplamCiro: record.tutar,
      masaSayisi: 0,
      enCokSatilanlar: Object.entries(siparisMap).map(([ad, adet]) => ({ ad, adet })),
      nakitCiro: record.yontem === 'nakit' ? record.tutar : 0,
      krediKartiCiro: record.yontem === 'kredi_karti' ? record.tutar : 0,
      ibanCiro: record.yontem === 'iban' ? record.tutar : 0,
    } satisfies DailyStats)
  } else {
    const birlesikMap: Record<string, number> = {}
    for (const item of mevcut.enCokSatilanlar) {
      birlesikMap[item.ad] = (birlesikMap[item.ad] ?? 0) + item.adet
    }
    for (const [ad, adet] of Object.entries(siparisMap)) {
      birlesikMap[ad] = (birlesikMap[ad] ?? 0) + adet
    }

    const nakit = mevcut.nakitCiro ?? 0
    const kredi = mevcut.krediKartiCiro ?? 0
    const iban = mevcut.ibanCiro ?? 0

    await kvSet(statsKey, {
      ...mevcut,
      toplamCiro: mevcut.toplamCiro + record.tutar,
      enCokSatilanlar: Object.entries(birlesikMap)
        .map(([ad, adet]) => ({ ad, adet }))
        .sort((a, b) => b.adet - a.adet)
        .slice(0, 10),
      nakitCiro: nakit + (record.yontem === 'nakit' ? record.tutar : 0),
      krediKartiCiro: kredi + (record.yontem === 'kredi_karti' ? record.tutar : 0),
      ibanCiro: iban + (record.yontem === 'iban' ? record.tutar : 0),
    } satisfies DailyStats)
  }
}

export async function incrementStatsMasaCount(tarih: string): Promise<void> {
  const statsKey = KEYS.dailyStats(tarih)
  const mevcut = await getDailyStats(tarih)
  if (mevcut) {
    await kvSet(statsKey, {
      ...mevcut,
      masaSayisi: mevcut.masaSayisi + 1
    } satisfies DailyStats)
  } else {
    await kvSet(statsKey, {
      tarih,
      toplamCiro: 0,
      masaSayisi: 1,
      enCokSatilanlar: []
    } satisfies DailyStats)
  }
}

export async function getPaginatedPayments(date: string, page: number, limit: number) {
  const redis = getRedis()
  const paymentsKey = `stats:payments:${date}`
  
  const total = await redis.llen(paymentsKey)
  
  const start = Math.max(0, total - (page * limit))
  const end = Math.max(-1, total - ((page - 1) * limit) - 1)
  
  let items: any[] = []
  
  if (total > 0 && start <= end) {
    const raws = await redis.lrange(paymentsKey, start, end)
    items = raws
      .map(r => {
        try { return JSON.parse(r) } catch { return null }
      })
      .filter(i => i !== null)
      .reverse() // En yeniler başta gelsin
  }
  
  return {
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}
