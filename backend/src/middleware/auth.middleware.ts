import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { logger } from '../utils/logger'

/**
 * JWT 토큰 검증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하여 사용자 정보를 검증합니다.
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN" 형식

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required',
      })
    }

    // 토큰 검증 및 사용자 정보 조회
    const user = await authService.getUserByToken(token)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      })
    }

    // 사용자 정보를 req에 추가
    req.user = user
    req.userId = user.id
    next()
  } catch (error: unknown) {
    logger.error('Error in authenticateToken:', error)
    return res.status(401).json({
      success: false,
      error: 'Failed to authenticate token',
    })
  }
}

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const user = await authService.getUserByToken(token)
      if (user) {
        req.user = user
        req.userId = user.id
      }
    }

    next()
  } catch (error: unknown) {
    // 에러가 발생해도 통과 (선택적 인증)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.warn('Error in optionalAuth (ignored):', errorMessage)
    next()
  }
}

