import Redis from 'ioredis'

let _redis: Redis | null = null
function getRedis(): Redis {
  if (_redis) return _redis
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  _redis = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 2 })
  return _redis
}

async function kvGet<T>(key: string): Promise<T | null> {
  const raw = await getRedis().get(key)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}
async function kvSet(key: string, value: unknown): Promise<void> {
  await getRedis().set(key, JSON.stringify(value))
}

export interface Tenant {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  active: boolean
}

const TENANTS_KEY = 'admin:tenants'
const TENANT_KEY = (id: string) => `admin:tenant:${id}`

export async function getAllTenants(): Promise<Tenant[]> {
  const redis = getRedis()
  const ids = await redis.smembers(TENANTS_KEY)
  if (ids.length === 0) return []
  const raws = await redis.mget(...ids.map(TENANT_KEY))
  return raws
    .map(r => { try { return r ? JSON.parse(r) as Tenant : null } catch { return null } })
    .filter((t): t is Tenant => t !== null)
}

export async function getTenant(id: string): Promise<Tenant | null> {
  return kvGet<Tenant>(TENANT_KEY(id))
}

export async function getTenantByEmail(email: string): Promise<Tenant | null> {
  const all = await getAllTenants()
  return all.find(t => t.email === email) ?? null
}

export async function createTenant(tenant: Tenant): Promise<void> {
  const redis = getRedis()
  await Promise.all([
    kvSet(TENANT_KEY(tenant.id), tenant),
    redis.sadd(TENANTS_KEY, tenant.id)
  ])
}

export async function updateTenant(tenant: Tenant): Promise<void> {
  await kvSet(TENANT_KEY(tenant.id), tenant)
}

export async function deleteTenant(id: string): Promise<void> {
  const redis = getRedis()
  await Promise.all([
    redis.del(TENANT_KEY(id)),
    redis.srem(TENANTS_KEY, id)
  ])
}
