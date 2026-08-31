import { MongoClient } from 'mongodb'

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

export async function getDb(env: any) {
  let connectionString = null
  if (env?.MONGODB?.connectionString) {
    connectionString = env.MONGODB.connectionString
  } else if (env?.MONGODB_URI) {
    connectionString = env.MONGODB_URI
  } else if (process.env.MONGODB_URI) {
    connectionString = process.env.MONGODB_URI
  }

  if (!connectionString) {
    throw new Error("MongoDB connection string not found. Set HYPERDRIVE binding MONGODB or MONGODB_URI env")
  }

  if (!client) {
    client = new MongoClient(connectionString)
    clientPromise = client.connect()
  }
  await clientPromise
  return client!.db('citizen_portal')
}

export function getCollection(db: any, name: string) {
  return db.collection(name)
}
