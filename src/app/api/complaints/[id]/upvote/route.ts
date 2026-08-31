import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const result = await complaints.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $inc: { upvotes: 1 } },
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
