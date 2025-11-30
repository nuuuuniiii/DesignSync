import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DesignSync API Server' })
})

// API routes will be added here
app.use('/api', (req, res) => {
  res.json({ message: 'API endpoint - routes will be added here' })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.message, { stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})

