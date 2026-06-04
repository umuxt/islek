import { NextResponse } from 'next/server'
import {
  getUsers,
  setUsers,
  getUserTrackingEnabled,
  setUserTrackingEnabled,
  CafeUser
} from '@islek/db'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) {
    return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
  }

  try {
    const [users, trackingEnabled] = await Promise.all([
      getUsers(tenantId),
      getUserTrackingEnabled(tenantId),
    ])
    return NextResponse.json({ users, trackingEnabled })
  } catch (err) {
    console.error('[GET /api/users]', err)
    return NextResponse.json({ error: 'Kullanıcılar alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) {
    return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { users, trackingEnabled } = body as { users?: CafeUser[]; trackingEnabled?: boolean }

    if (users !== undefined) {
      await setUsers(tenantId, users)
    }
    if (trackingEnabled !== undefined) {
      await setUserTrackingEnabled(tenantId, trackingEnabled)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/users]', err)
    return NextResponse.json({ error: 'Kullanıcılar kaydedilemedi' }, { status: 500 })
  }
}
