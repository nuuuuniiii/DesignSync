import { Request, Response } from 'express'
import { feedbacksService, CreateFeedbackRequest } from '../services/feedbacks.service'
import { logger } from '../utils/logger'

export class FeedbacksController {
  async createFeedback(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        })
      }

      const feedbackData: CreateFeedbackRequest = {
        project_id: req.body.project_id,
        user_id: userId,
        ratings: req.body.ratings || {},
        feedbacks: req.body.feedbacks || [],
      }

      // 필수 필드 검증
      if (!feedbackData.project_id) {
        return res.status(400).json({
          success: false,
          error: 'project_id is required',
        })
      }

      if (feedbackData.feedbacks.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one feedback is required',
        })
      }

      const result = await feedbacksService.createFeedback(feedbackData)

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      logger.error('Error creating feedback:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create feedback',
      })
    }
  }
}

export const feedbacksController = new FeedbacksController()

