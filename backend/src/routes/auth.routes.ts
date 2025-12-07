import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

// 회원가입 (인증 불필요)
router.post('/signup', (req, res) => authController.signUp(req, res))

// 로그인 (인증 불필요)
router.post('/signin', (req, res) => authController.signIn(req, res))

// 현재 사용자 정보 조회 (인증 필요)
router.get('/me', authenticateToken, (req, res) => authController.getMe(req, res))

export default router

