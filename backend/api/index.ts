// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// 환경변수 로드
dotenv.config()

// Express 앱 생성
const app = express()

// CORS 설정
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'
const allowedOrigins = CORS_ORIGIN.includes(',')
  ? CORS_ORIGIN.split(',').map((o: string) => o.trim())
  : [CORS_ORIGIN]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS. Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 라우트 import (빌드된 파일 참조)
// @ts-ignore - dist 폴더의 빌드된 파일 참조
import testRoutes from '../dist/routes/test.routes'
// @ts-ignore
import projectsRoutes from '../dist/routes/projects.routes'
// @ts-ignore
import designsRoutes from '../dist/routes/designs.routes'
// @ts-ignore
import authRoutes from '../dist/routes/auth.routes'
// @ts-ignore
import feedbacksRoutes from '../dist/routes/feedbacks.routes'

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DesignSync API Server' })
})

// API routes
app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/projects', designsRoutes)
app.use('/api/feedbacks', feedbacksRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message)
  if (err.stack) {
    console.error('Stack:', err.stack)
  }
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

// Vercel serverless function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res)
}
