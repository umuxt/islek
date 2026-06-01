import { NextResponse } from 'next/server'
import { getAllSessions } from '@islek/db'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const sessions = await getAllSessions(tenantId)
    return Response.json(sessions)
  } catch (err) {
    console.error('[GET /api/sessions]', err)
    return Response.json({ error: 'Oturumlar alınamadı' }, { status: 500 })
  }
}
