interface CloudflareEnv {
  MONGODB: {
    connectionString: string
  }
  MONGODB_URI: string
  JWT_SECRET: string
  NODE_ENV: string
}

export default CloudflareEnv
