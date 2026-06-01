import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEV_ADMIN_PASSWORD = 'admin123'
const DEV_ADMIN_SESSION_SECRET = 'dev-admin-session'

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_SECRET ?? (process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_PASSWORD)
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_SECRET ?? (process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_SESSION_SECRET)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  const adminPassword = getAdminPassword()
  const adminSessionSecret = getAdminSessionSecret()

  if (!adminPassword || !adminSessionSecret) {
    return NextResponse.json({ error: 'Admin ortam değişkenleri eksik' }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', adminSessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: '/',
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  return NextResponse.json({ success: true })
}
