import { NextRequest, NextResponse } from 'next/server'
import { getAllTenants, createTenant, type Tenant } from '@islek/db'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tenants = await getAllTenants()
    // Şifreleri dışarı verme
    const safe = tenants.map(({ passwordHash: _, ...t }) => t)
    return NextResponse.json(safe)
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur' }, { status: 400 })
    }

    const { getAllTenants: check } = await import('@islek/db')
    const existing = await check()
    if (existing.some(t => t.email === email)) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 409 })
    }

    // Basit hash (prod'da bcrypt kullanın)
    const { createHash } = await import('crypto')
    const passwordHash = createHash('sha256').update(password).digest('hex')

    const tenant: Tenant = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      active: true,
    }

    await createTenant(tenant)

    const { passwordHash: _, ...safe } = tenant
    return NextResponse.json(safe, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
