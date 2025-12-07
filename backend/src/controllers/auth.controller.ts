import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { SignUpRequest, SignInRequest } from '../types/auth.types'
import { logger } from '../utils/logger'

export class AuthController {
  /**
   * 회원가입
   * POST /api/auth/signup
   */
  async signUp(req: Request, res: Response) {
    try {
      const signUpData: SignUpRequest = req.body

      // 필수 필드 검증
      if (!signUpData.email || !signUpData.password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        })
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(signUpData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
        })
      }

      // 비밀번호 길이 검증 (최소 6자)
      if (signUpData.password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters',
        })
      }

      const result = await authService.signUp(signUpData)

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      logger.error('Error in signUp:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to sign up',
      })
    }
  }

  /**
   * 로그인
   * POST /api/auth/signin
   */
  async signIn(req: Request, res: Response) {
    try {
      const signInData: SignInRequest = req.body

      // 필수 필드 검증
      if (!signInData.email || !signInData.password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        })
      }

      const result = await authService.signIn(signInData)

      res.json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      logger.error('Error in signIn:', error)
      
      // 인증 실패인 경우 401 반환
      if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        })
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to sign in',
      })
    }
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   * GET /api/auth/me
   */
  async getMe(req: Request, res: Response) {
    try {
      // 인증 미들웨어에서 설정한 user 정보 사용
      const user = (req as any).user

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        })
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (error: any) {
      logger.error('Error in getMe:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get user info',
      })
    }
  }
}

export const authController = new AuthController()

