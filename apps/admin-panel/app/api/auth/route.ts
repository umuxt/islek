import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  const adminSecret = process.env.ADMIN_SECRET ?? 'admin123'

  if (password !== adminSecret) {
    return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', adminSecret, {
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
