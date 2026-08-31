import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const auth = verifyToken(request, env)
    if (!auth) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userComplaints = await complaints.find({ createdBy: auth.name || auth.userId }).toArray()

    return Response.json({ success: true, data: userComplaints })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
