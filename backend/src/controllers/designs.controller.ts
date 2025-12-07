import { Request, Response } from 'express'
import { designsService } from '../services/designs.service'
import { CreateDesignWithImagesRequest } from '../types/design.types'
import { logger } from '../utils/logger'

export class DesignsController {
  /**
   * 디자인 생성 및 이미지 업로드
   * POST /api/projects/:projectId/designs
   */
  async createDesign(req: Request, res: Response) {
    try {
      const { projectId } = req.params
      const designName = req.body.name || req.body.designName

      if (!designName) {
        return res.status(400).json({
          success: false,
          error: 'Design name is required',
        })
      }

      const files = req.files as Express.Multer.File[]
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one image is required',
        })
      }

      // 질문 데이터 파싱 (FormData에서 JSON 문자열로 전송될 수 있음)
      let customQuestions: string[] = []
      let selectedQuestions: string[] = []
      let questionCategory: string | undefined

      if (req.body.customQuestions) {
        try {
          customQuestions = typeof req.body.customQuestions === 'string' 
            ? JSON.parse(req.body.customQuestions) 
            : req.body.customQuestions
        } catch (e) {
          logger.warn('Failed to parse customQuestions:', e)
        }
      }

      if (req.body.selectedQuestions) {
        try {
          selectedQuestions = typeof req.body.selectedQuestions === 'string'
            ? JSON.parse(req.body.selectedQuestions)
            : req.body.selectedQuestions
        } catch (e) {
          logger.warn('Failed to parse selectedQuestions:', e)
        }
      }

      if (req.body.questionCategory) {
        questionCategory = req.body.questionCategory
      }

      const designData: CreateDesignWithImagesRequest = {
        name: designName,
        imageFiles: files,
        customQuestions: customQuestions.length > 0 ? customQuestions : undefined,
        selectedQuestions: selectedQuestions.length > 0 ? selectedQuestions : undefined,
        questionCategory: questionCategory,
      }

      const result = await designsService.createDesignWithImages(projectId, designData)

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      logger.error('Error creating design:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create design',
      })
    }
  }
}

export const designsController = new DesignsController()

