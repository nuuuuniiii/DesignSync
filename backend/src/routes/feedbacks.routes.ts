import { Router } from 'express'
import { feedbacksController } from '../controllers/feedbacks.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

// 피드백 생성은 인증 필요
router.post('/', authenticateToken, (req, res) => feedbacksController.createFeedback(req, res))

export default router

