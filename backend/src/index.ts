import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import testRoutes from './routes/test.routes'
import projectsRoutes from './routes/projects.routes'
import designsRoutes from './routes/designs.routes'
import authRoutes from './routes/auth.routes'
import feedbacksRoutes from './routes/feedbacks.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
// CORS 설정: 여러 origin 허용 (쉼표로 구분)
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

// 여러 origin을 배열로 변환
const allowedOrigins = CORS_ORIGIN.includes(',')
  ? CORS_ORIGIN.split(',').map((o: string) => o.trim())
  : [CORS_ORIGIN]

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 없거나 (같은 도메인) 허용된 origin 목록에 있으면 허용
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

// API routes
app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/projects', designsRoutes)
app.use('/api/feedbacks', feedbacksRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.message, { stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
})

// Start server with port fallback
const startServer = (port: number) => {
  const server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is in use, trying another one...`)
      startServer(port + 1)
    } else {
      logger.error(`Server error: ${err.message}`, { stack: err.stack })
      throw err
    }
  })
}

// Start server only in non-Vercel environments
// In Vercel, the serverless function will handle requests
if (!process.env.VERCEL) {
  startServer(Number(PORT))
}

// Export app for Vercel serverless functions
export default app

