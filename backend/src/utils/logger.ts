import winston from 'winston'
import path from 'path'
import fs from 'fs'

// Vercel 환경 확인 (읽기 전용 파일 시스템)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'designsync-backend' },
  transports: [],
})

// Vercel 환경이 아닐 때만 파일 로깅 사용
if (!isVercel) {
  try {
    const logsDir = path.join(__dirname, '../../logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }
    logger.add(new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }))
    logger.add(new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }))
  } catch (error) {
    // 파일 시스템 에러 무시 (Vercel 등 제한된 환경)
    console.warn('File logging not available:', error instanceof Error ? error.message : String(error))
  }
}

// 항상 콘솔 로깅 사용 (Vercel 로그에 출력됨)
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
)

export { logger }

