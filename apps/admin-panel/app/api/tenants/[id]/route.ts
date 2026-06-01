import { NextRequest, NextResponse } from 'next/server'
import { getTenant, updateTenant, deleteTenant, type Tenant } from '@islek/db'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const tenant = await getTenant(id)
    if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

    let passwordHash = tenant.passwordHash
    if (body.password) {
      const { createHash } = await import('crypto')
      passwordHash = createHash('sha256').update(body.password).digest('hex')
    }

    const updated: Tenant = {
      ...tenant,
      name: body.name ?? tenant.name,
      email: body.email ?? tenant.email,
      active: body.active ?? tenant.active,
      passwordHash,
    }

    await updateTenant(updated)
    const { passwordHash: _, ...safe } = updated
    return NextResponse.json(safe)
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteTenant(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
