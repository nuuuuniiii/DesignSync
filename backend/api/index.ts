// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../src/index'

// Vercel serverless function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res)
}
