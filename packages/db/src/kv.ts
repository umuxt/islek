import Redis from 'ioredis'
import type {
  MenuItem,
  TableConfig,
  PricingPolicy,
  TableSession,
  DailyStats,
  Kategori,
  FloorConfig,
  CafeUser,
} from './types'

// ─── Redis istemcisi ─────────────────────────────────────
let _redis: Redis | null = null

function getRedis(): Redis {
  if (_redis) return _redis
  const url = process.env.REDIS_URL ?? process.env.KV_URL ?? process.env.UPSTASH_REDIS_URL ?? 'redis://localhost:6379'
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
export const getKeys = (tenantId: string) => ({
  menu: `tenant:${tenantId}:config:menu`,
  categories: `tenant:${tenantId}:config:categories`,
  tables: `tenant:${tenantId}:config:tables`,
  floors: `tenant:${tenantId}:config:floors`,
  pricing: `tenant:${tenantId}:config:pricing`,
  activeSessions: `tenant:${tenantId}:session:active`,
  session: (id: string) => `tenant:${tenantId}:session:table:${id}`,
  dailyStats: (date: string) => `tenant:${tenantId}:stats:daily:${date}`,
  dailyStatsIndex: `tenant:${tenantId}:stats:daily:index`,
  payments: (date: string) => `tenant:${tenantId}:stats:payments:${date}`,
  userTrackingEnabled: `tenant:${tenantId}:config:user-tracking-enabled`,
  users: `tenant:${tenantId}:config:users`,
})

// ─── Menü ────────────────────────────────────────────────
export async function getMenu(tenantId: string): Promise<MenuItem[]> {
  return (await kvGet<MenuItem[]>(getKeys(tenantId).menu)) ?? []
}

export async function setMenu(tenantId: string, menu: MenuItem[]): Promise<void> {
  await kvSet(getKeys(tenantId).menu, menu)
}

// ─── Kategoriler ─────────────────────────────────────────
export async function getCategories(tenantId: string): Promise<Kategori[]> {
  return (await kvGet<Kategori[]>(getKeys(tenantId).categories)) ?? []
}

export async function setCategories(tenantId: string, categories: Kategori[]): Promise<void> {
  await kvSet(getKeys(tenantId).categories, categories)
}

// ─── Masa Konfigürasyonu ─────────────────────────────────
export const DEFAULT_FLOOR_ID = 'zemin'
export const DEFAULT_FLOORS: FloorConfig[] = [{ id: DEFAULT_FLOOR_ID, ad: 'Zemin Kat' }]

function normalizeFloors(floors: FloorConfig[] | null): FloorConfig[] {
  const list = Array.isArray(floors) ? floors.filter((floor) => floor.id) : []
  const hasDefault = list.some((floor) => floor.id === DEFAULT_FLOOR_ID)
  const withDefault = hasDefault ? list : [...DEFAULT_FLOORS, ...list]
  return withDefault.map((floor) => ({
    id: floor.id,
    ad: floor.ad?.trim() || (floor.id === DEFAULT_FLOOR_ID ? 'Zemin Kat' : floor.id),
  }))
}

function normalizeTables(tables: TableConfig[] | null): TableConfig[] {
  const list = Array.isArray(tables) ? tables : []
  return list.map((table) => ({
    ...table,
    katId: table.katId || DEFAULT_FLOOR_ID,
  }))
}

export async function getFloors(tenantId: string): Promise<FloorConfig[]> {
  return normalizeFloors(await kvGet<FloorConfig[]>(getKeys(tenantId).floors))
}

export async function setFloors(tenantId: string, floors: FloorConfig[]): Promise<void> {
  await kvSet(getKeys(tenantId).floors, normalizeFloors(floors))
}

export async function getTables(tenantId: string): Promise<TableConfig[]> {
  return normalizeTables(await kvGet<TableConfig[]>(getKeys(tenantId).tables))
}

export async function setTables(tenantId: string, tables: TableConfig[]): Promise<void> {
  await kvSet(getKeys(tenantId).tables, normalizeTables(tables))
}

// ─── Ücretlendirme ───────────────────────────────────────
const DEFAULT_PRICING: PricingPolicy = { mod: 'siparis_bazli' }

export async function getPricing(tenantId: string): Promise<PricingPolicy> {
  return (await kvGet<PricingPolicy>(getKeys(tenantId).pricing)) ?? DEFAULT_PRICING
}

export async function setPricing(tenantId: string, policy: PricingPolicy): Promise<void> {
  await kvSet(getKeys(tenantId).pricing, policy)
}

// ─── Oturumlar ───────────────────────────────────────────
export async function getSession(tenantId: string, masaId: string): Promise<TableSession | null> {
  return kvGet<TableSession>(getKeys(tenantId).session(masaId))
}

export async function getAllSessions(tenantId: string): Promise<TableSession[]> {
  const redis = getRedis()
  const KEYS = getKeys(tenantId)
  
  // Lua script to fetch all active sessions in a single round-trip (conserves Upstash limits)
  const luaScript = `
    local activeIds = redis.call('SMEMBERS', KEYS[1])
    if #activeIds == 0 then
      return {}
    end
    local keys = {}
    for i, id in ipairs(activeIds) do
      keys[i] = KEYS[2] .. id
    end
    return redis.call('MGET', unpack(keys))
  `
  
  const sessionPrefix = KEYS.session('')
  const raws = await redis.eval(
    luaScript,
    2,
    KEYS.activeSessions,
    sessionPrefix
  ) as (string | null)[]
  
  return raws
    .map((r) => { try { return r ? JSON.parse(r) as TableSession : null } catch { return null } })
    .filter((s): s is TableSession => s !== null)
}

export async function setSession(tenantId: string, session: TableSession): Promise<void> {
  const redis = getRedis()
  const KEYS = getKeys(tenantId)
  await Promise.all([
    redis.set(KEYS.session(session.masaId), JSON.stringify(session)),
    redis.sadd(KEYS.activeSessions, session.masaId)
  ])
}

export async function deleteSession(tenantId: string, masaId: string): Promise<void> {
  const redis = getRedis()
  const KEYS = getKeys(tenantId)
  await Promise.all([
    redis.del(KEYS.session(masaId)),
    redis.srem(KEYS.activeSessions, masaId)
  ])
}

// ─── İstatistikler ───────────────────────────────────────
export async function getDailyStats(tenantId: string, tarih: string): Promise<DailyStats | null> {
  const redis = getRedis()
  const KEYS = getKeys(tenantId)
  
  // Try fetching from the indexed Hash first
  const indexed = await redis.hget(KEYS.dailyStatsIndex, tarih)
  if (indexed) {
    try {
      return JSON.parse(indexed) as DailyStats
    } catch {
      return null
    }
  }
  
  // Fallback to individual legacy key
  const legacy = await kvGet<DailyStats>(KEYS.dailyStats(tarih))
  if (legacy) {
    // Migrate to Hash index asynchronously in background
    redis.hset(KEYS.dailyStatsIndex, tarih, JSON.stringify(legacy)).catch(err => {
      console.error('[Migration to dailyStatsIndex failed]', err)
    })
    return legacy
  }
  
  return null
}

export async function getRecentStats(tenantId: string, gunSayisi = 30): Promise<DailyStats[]> {
  const bugun = new Date()
  const dates: string[] = []
  const KEYS = getKeys(tenantId)
  
  for (let i = 0; i < gunSayisi; i++) {
    const tarih = new Date(bugun)
    tarih.setDate(bugun.getDate() - i)
    dates.push(tarih.toISOString().split('T')[0])
  }
  
  const redis = getRedis()
  
  // Query Hash index in a single round-trip using HMGET (avoids cross-slot MGET penalty)
  const raws = await redis.hmget(KEYS.dailyStatsIndex, ...dates)
  const sonuclar: DailyStats[] = []
  const missingDates: string[] = []
  
  raws.forEach((r, idx) => {
    const date = dates[idx]
    if (r) {
      try {
        sonuclar.push(JSON.parse(r) as DailyStats)
      } catch {}
    } else {
      missingDates.push(date)
    }
  })
  
  // Lazy migration: if there are missing dates in Hash, check legacy individual keys
  if (missingDates.length > 0) {
    const legacyKeys = missingDates.map(d => KEYS.dailyStats(d))
    const legacyRaws = await redis.mget(...legacyKeys)
    const migrationPromises: Promise<any>[] = []
    
    legacyRaws.forEach((r, idx) => {
      const date = missingDates[idx]
      if (r) {
        try {
          const parsed = JSON.parse(r) as DailyStats
          sonuclar.push(parsed)
          migrationPromises.push(redis.hset(KEYS.dailyStatsIndex, date, r))
        } catch {}
      }
    })
    
    if (migrationPromises.length > 0) {
      Promise.all(migrationPromises).catch(err => {
        console.error('[Bulk migration to dailyStatsIndex failed]', err)
      })
    }
  }
  
  return sonuclar.sort((a, b) => a.tarih.localeCompare(b.tarih))
}

// ─── Ödeme Kayıt & İstatistik ─────────────────────────────
export async function addPaymentRecord(tenantId: string, record: {
  id: string
  masaId: string
  masaAdi: string
  tutar: number
  yontem: 'nakit' | 'kredi_karti' | 'iban'
  zamani: string
  urunler: { menuItemId?: string; ad: string; fiyat: number; adet: number }[]
  garson?: string
}): Promise<void> {
  const redis = getRedis()
  const bugun = record.zamani.split('T')[0]
  const KEYS = getKeys(tenantId)

  // Detaylı ödeme kaydını günlük listeye de ekle (günlük analizler için)
  const paymentsKey = KEYS.payments(bugun)
  await redis.rpush(paymentsKey, JSON.stringify(record))

  // DailyStats güncelle
  const statsKey = KEYS.dailyStats(bugun)
  const mevcut = await getDailyStats(tenantId, bugun)

  const siparisMap: Record<string, number> = {}
  for (const u of record.urunler) {
    if (u.menuItemId) { // Sanal kalemleri en çok satılanlar listesine ekleme
      siparisMap[u.ad] = (siparisMap[u.ad] ?? 0) + u.adet
    }
  }

  let updatedStats: DailyStats
  if (!mevcut) {
    updatedStats = {
      tarih: bugun,
      toplamCiro: record.tutar,
      masaSayisi: 0,
      enCokSatilanlar: Object.entries(siparisMap).map(([ad, adet]) => ({ ad, adet })),
      nakitCiro: record.yontem === 'nakit' ? record.tutar : 0,
      krediKartiCiro: record.yontem === 'kredi_karti' ? record.tutar : 0,
      ibanCiro: record.yontem === 'iban' ? record.tutar : 0,
    } satisfies DailyStats
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

    updatedStats = {
      ...mevcut,
      toplamCiro: mevcut.toplamCiro + record.tutar,
      enCokSatilanlar: Object.entries(birlesikMap)
        .map(([ad, adet]) => ({ ad, adet }))
        .sort((a, b) => b.adet - a.adet)
        .slice(0, 10),
      nakitCiro: nakit + (record.yontem === 'nakit' ? record.tutar : 0),
      krediKartiCiro: kredi + (record.yontem === 'kredi_karti' ? record.tutar : 0),
      ibanCiro: iban + (record.yontem === 'iban' ? record.tutar : 0),
    } satisfies DailyStats
  }

  // Save to both legacy key and index Hash
  await Promise.all([
    redis.set(statsKey, JSON.stringify(updatedStats)),
    redis.hset(KEYS.dailyStatsIndex, bugun, JSON.stringify(updatedStats))
  ])
}

export async function incrementStatsMasaCount(tenantId: string, tarih: string): Promise<void> {
  const KEYS = getKeys(tenantId)
  const statsKey = KEYS.dailyStats(tarih)
  const mevcut = await getDailyStats(tenantId, tarih)
  const redis = getRedis()
  
  let updatedStats: DailyStats
  if (mevcut) {
    updatedStats = {
      ...mevcut,
      masaSayisi: mevcut.masaSayisi + 1
    }
  } else {
    updatedStats = {
      tarih,
      toplamCiro: 0,
      masaSayisi: 1,
      enCokSatilanlar: []
    }
  }
  
  await Promise.all([
    redis.set(statsKey, JSON.stringify(updatedStats)),
    redis.hset(KEYS.dailyStatsIndex, tarih, JSON.stringify(updatedStats))
  ])
}

export async function getPaginatedPayments(tenantId: string, date: string, page: number, limit: number) {
  const redis = getRedis()
  const paymentsKey = getKeys(tenantId).payments(date)
  
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

export async function getPaymentsList(tenantId: string, date: string): Promise<any[]> {
  const redis = getRedis()
  const paymentsKey = getKeys(tenantId).payments(date)
  const raws = await redis.lrange(paymentsKey, 0, -1)
  const items: any[] = []
  raws.forEach(r => {
    if (r) {
      try {
        items.push(JSON.parse(r))
      } catch {}
    }
  })
  return items
}

// ─── Kullanıcılar & Garson Takibi ─────────────────────────
export async function getUserTrackingEnabled(tenantId: string): Promise<boolean> {
  const val = await getRedis().get(getKeys(tenantId).userTrackingEnabled)
  return val === 'true'
}

export async function setUserTrackingEnabled(tenantId: string, enabled: boolean): Promise<void> {
  await getRedis().set(getKeys(tenantId).userTrackingEnabled, enabled ? 'true' : 'false')
}

export async function getUsers(tenantId: string): Promise<CafeUser[]> {
  return (await kvGet<CafeUser[]>(getKeys(tenantId).users)) ?? []
}

export async function setUsers(tenantId: string, users: CafeUser[]): Promise<void> {
  await kvSet(getKeys(tenantId).users, users)
}
