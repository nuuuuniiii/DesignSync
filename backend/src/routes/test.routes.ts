import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import cloudinary from '../config/cloudinary'
import { logger } from '../utils/logger'

const router = Router()

/**
 * GET /api/test/database
 * 데이터베이스 연결 테스트
 */
router.get('/database', async (_req: Request, res: Response) => {
  try {
    // 환경변수 확인
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: 'Supabase environment variables are not set',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
        },
      })
    }

    // 플레이스홀더 값 확인
    if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-')) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: 'Please update Supabase credentials in .env file with actual values',
        hint: 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env',
      })
    }

    // users 테이블이 존재하는지 확인
    const { error } = await supabaseAdmin.from('users').select('count').limit(1)

    if (error) {
      logger.error('Database connection test failed:', error)
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    res.json({
      success: true,
      message: 'Database connection successful',
      tables: {
        users: 'connected',
      },
    })
  } catch (error: unknown) {
    logger.error('Database test error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Database test failed'
    const errorStack = error instanceof Error ? error.stack : undefined
    return res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
    })
  }
})

/**
 * GET /api/test/cloudinary
 * Cloudinary 연결 테스트
 */
router.get('/cloudinary', async (_req: Request, res: Response) => {
  try {
    // 환경변수 확인
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary connection failed',
        error: 'Cloudinary environment variables are not set',
        details: {
          hasCloudName: !!cloudName,
          hasApiKey: !!apiKey,
          hasApiSecret: !!apiSecret,
        },
      })
    }

    // 플레이스홀더 값 확인
    if (
      cloudName.includes('your-') ||
      apiKey.includes('your-') ||
      apiSecret.includes('your-')
    ) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary connection failed',
        error: 'Please update Cloudinary credentials in .env file with actual values',
        hint: 'Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env',
      })
    }

    // Cloudinary 계정 정보 확인 (ping)
    const result = await cloudinary.api.ping()

    res.json({
      success: true,
      message: 'Cloudinary connection successful',
      status: result.status,
    })
  } catch (error: unknown) {
    logger.error('Cloudinary test error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Cloudinary connection failed'
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorDetails = error && typeof error === 'object' && 'http_code' in error && 'name' in error
      ? { httpCode: error.http_code, name: error.name }
      : undefined
    return res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: errorMessage,
      details: errorDetails,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
    })
  }
})

/**
 * GET /api/test/env
 * 환경변수 설정 확인 (민감한 정보는 마스킹)
 */
router.get('/env', async (_req: Request, res: Response) => {
  const envStatus = {
    supabase: {
      url: process.env.SUPABASE_URL
        ? `${process.env.SUPABASE_URL.substring(0, 30)}...`
        : 'NOT SET',
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      isPlaceholder: process.env.SUPABASE_URL?.includes('your-project') || false,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      isPlaceholder:
        process.env.CLOUDINARY_CLOUD_NAME?.includes('your-') ||
        process.env.CLOUDINARY_API_KEY?.includes('your-') ||
        false,
    },
    server: {
      port: process.env.PORT || '8000',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development',
    },
  }

  res.json({
    success: true,
    message: 'Environment variables status',
    env: envStatus,
  })
})

/**
 * GET /api/test/all
 * 모든 연결 테스트
 */
router.get('/all', async (_req: Request, res: Response) => {
  const results: {
    database: { success: boolean; message: string; error?: string; details?: string | number | { httpCode?: unknown; name?: unknown } }
    cloudinary: { success: boolean; message: string; error?: string; details?: string | number | { httpCode?: unknown; name?: unknown } }
  } = {
    database: { success: false, message: '' },
    cloudinary: { success: false, message: '' },
  }

  // Database 테스트
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      results.database = {
        success: false,
        message: 'Database connection failed',
        error: 'Supabase environment variables are not set',
      }
    } else if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-')) {
      results.database = {
        success: false,
        message: 'Database connection failed',
        error: 'Please update Supabase credentials in .env file with actual values',
      }
    } else {
      const { error } = await supabaseAdmin.from('users').select('count').limit(1)
      if (error) throw error
      results.database = { success: true, message: 'Database connected' }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Database connection failed'
    const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : undefined
    const errorDetails = error && typeof error === 'object' && 'details' in error ? error.details : undefined
    const detailsValue: string | number | { httpCode?: unknown; name?: unknown } | undefined = 
      typeof errorCode === 'string' || typeof errorCode === 'number' 
        ? errorCode 
        : typeof errorDetails === 'string' || typeof errorDetails === 'number'
        ? errorDetails
        : undefined
    results.database = {
      success: false,
      message: 'Database connection failed',
      error: errorMessage,
      details: detailsValue,
    }
  }

  // Cloudinary 테스트
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      results.cloudinary = {
        success: false,
        message: 'Cloudinary connection failed',
        error: 'Cloudinary environment variables are not set',
      }
    } else if (
      cloudName.includes('your-') ||
      apiKey.includes('your-') ||
      apiSecret.includes('your-')
    ) {
      results.cloudinary = {
        success: false,
        message: 'Cloudinary connection failed',
        error: 'Please update Cloudinary credentials in .env file with actual values',
      }
    } else {
      await cloudinary.api.ping()
      results.cloudinary = { success: true, message: 'Cloudinary connected' }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Cloudinary connection failed'
    const errorHttpCode = error && typeof error === 'object' && 'http_code' in error ? error.http_code : undefined
    const errorName = error && typeof error === 'object' && 'name' in error ? error.name : undefined
    const detailsValue: string | number | { httpCode?: unknown; name?: unknown } | undefined = 
      typeof errorHttpCode === 'string' || typeof errorHttpCode === 'number'
        ? errorHttpCode
        : typeof errorName === 'string' || typeof errorName === 'number'
        ? errorName
        : undefined
    results.cloudinary = {
      success: false,
      message: 'Cloudinary connection failed',
      error: errorMessage,
      details: detailsValue,
    }
  }

  const allSuccess = results.database.success && results.cloudinary.success

  res.status(allSuccess ? 200 : 500).json({
    success: allSuccess,
    message: allSuccess ? 'All connections successful' : 'Some connections failed',
    results,
  })
})

export default router
