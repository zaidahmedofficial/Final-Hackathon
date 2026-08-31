import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const { id } = await params
    const complaint = await complaints.findOne({ _id: new ObjectId(id) })
    if (!complaint) {
      return Response.json({ success: false, error: 'Complaint not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: complaint })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
