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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DesignSync API Server' })
})

// 라우트 동적 import (빌드된 파일 참조)
// try-catch로 안전하게 처리
let testRoutes: express.Router
let projectsRoutes: express.Router
let designsRoutes: express.Router
let authRoutes: express.Router
let feedbacksRoutes: express.Router

try {
  // @ts-ignore - dist 폴더의 빌드된 파일 참조
  testRoutes = require('../dist/routes/test.routes').default
  // @ts-ignore
  projectsRoutes = require('../dist/routes/projects.routes').default
  // @ts-ignore
  designsRoutes = require('../dist/routes/designs.routes').default
  // @ts-ignore
  authRoutes = require('../dist/routes/auth.routes').default
  // @ts-ignore
  feedbacksRoutes = require('../dist/routes/feedbacks.routes').default

  // API routes
  app.use('/api/test', testRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/projects', projectsRoutes)
  app.use('/api/projects', designsRoutes)
  app.use('/api/feedbacks', feedbacksRoutes)
} catch (error) {
  console.error('Failed to load routes:', error)
  // 라우트 로드 실패 시 에러 핸들링
  app.use('/api/*', (req, res) => {
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Routes not loaded properly',
      details: error instanceof Error ? error.message : String(error)
    })
  })
}

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
