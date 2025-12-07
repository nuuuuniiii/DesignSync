import { Router } from 'express'
import { designsController } from '../controllers/designs.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { uploadMultipleImages } from '../middleware/upload.middleware'

const router = Router()

// 디자인 생성 및 이미지 업로드 (인증 필요)
router.post(
  '/:projectId/designs',
  authenticateToken,
  uploadMultipleImages,
  (req, res) => designsController.createDesign(req, res)
)

export default router

