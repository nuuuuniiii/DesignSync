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

// Health check (루트 경로와 /health 모두 지원)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'DesignSync API Server',
    routesLoaded,
    routeError: routeError ? routeError.message : null,
    endpoints: {
      health: '/health',
      api: '/api'
    }
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'DesignSync API Server',
    routesLoaded,
    routeError: routeError ? routeError.message : null
  })
})

// 라우트 동적 import (빌드된 파일 참조)
// try-catch로 안전하게 처리
let routesLoaded = false
let routeError: Error | null = null

try {
  console.log('Loading routes from dist folder...')
  
  // CommonJS require 사용 (빌드된 파일은 CommonJS 형식)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testRoutesModule = require('../dist/routes/test.routes')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const projectsRoutesModule = require('../dist/routes/projects.routes')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const designsRoutesModule = require('../dist/routes/designs.routes')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authRoutesModule = require('../dist/routes/auth.routes')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const feedbacksRoutesModule = require('../dist/routes/feedbacks.routes')

  const testRoutes = testRoutesModule.default || testRoutesModule
  const projectsRoutes = projectsRoutesModule.default || projectsRoutesModule
  const designsRoutes = designsRoutesModule.default || designsRoutesModule
  const authRoutes = authRoutesModule.default || authRoutesModule
  const feedbacksRoutes = feedbacksRoutesModule.default || feedbacksRoutesModule

  console.log('Routes loaded successfully')

  // API routes
  app.use('/api/test', testRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/projects', projectsRoutes)
  app.use('/api/projects', designsRoutes)
  app.use('/api/feedbacks', feedbacksRoutes)
  
  routesLoaded = true
} catch (error) {
  routeError = error instanceof Error ? error : new Error(String(error))
  console.error('Failed to load routes:', routeError.message)
  console.error('Stack:', routeError.stack)
  
  // 라우트 로드 실패 시 상세한 에러 정보 제공
  app.use('/api/*', (req, res) => {
    console.error('Route request failed - routes not loaded')
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Routes not loaded properly',
      details: routeError?.message || 'Unknown error',
      stack: routeError?.stack
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
