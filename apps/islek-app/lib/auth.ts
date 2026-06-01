import { cookies } from 'next/headers'

/**
 * API route'larında çağrılan, oturum çerezinden tenantId'yi okur.
 * Geçersiz/eksikse null döner — route'lar 401 dönmeli.
 */
export async function getTenantId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('tenant_id')?.value ?? null
}
