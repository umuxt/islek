import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllTenants } from '@islek/db'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre zorunludur' }, { status: 400 })
    }

    const passwordHash = createHash('sha256').update(password).digest('hex')
    const tenants = await getAllTenants()
    const tenant = tenants.find(t => t.email === email && t.passwordHash === passwordHash)

    if (!tenant) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 })
    }

    if (!tenant.active) {
      return NextResponse.json({ error: 'Hesabınız askıya alınmıştır. Lütfen yetkili ile iletişime geçin.' }, { status: 403 })
    }

    const cookieStore = await cookies()
    cookieStore.set('tenant_id', tenant.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      path: '/',
    })
    cookieStore.set('tenant_name', tenant.name, {
      httpOnly: false, // Client'ta okunabilsin (UI için)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return NextResponse.json({ success: true, tenantId: tenant.id, tenantName: tenant.name })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('tenant_id')
  cookieStore.delete('tenant_name')
  return NextResponse.json({ success: true })
}
