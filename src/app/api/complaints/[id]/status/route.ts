import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const { status, officerRemark } = await request.json()

    if (!status) {
      return Response.json({ success: false, error: 'Status is required' }, { status: 400 })
    }

    const { id } = await params
    const result = await complaints.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, officerRemark: officerRemark || '', updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      return Response.json({ success: false, error: 'Complaint not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: result.value })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
