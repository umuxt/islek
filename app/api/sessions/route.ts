import { getAllSessions } from '@/lib/kv'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sessions = await getAllSessions()
    return Response.json(sessions)
  } catch (err) {
    console.error('[GET /api/sessions]', err)
    return Response.json({ error: 'Oturumlar alınamadı' }, { status: 500 })
  }
}
