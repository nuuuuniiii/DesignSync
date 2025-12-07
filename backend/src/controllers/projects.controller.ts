import { Request, Response } from 'express'
import { projectsService } from '../services/projects.service'
import { CreateProjectRequest } from '../types/project.types'
import { logger } from '../utils/logger'

export class ProjectsController {
  async createProject(req: Request, res: Response) {
    try {
      const projectData: CreateProjectRequest = req.body
      
      // 필수 필드 검증
      if (!projectData.name || !projectData.platform || !projectData.category) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, platform, category',
        })
      }

      // 인증된 사용자 ID 사용 (인증 미들웨어에서 설정)
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        })
      }

      const project = await projectsService.createProject(projectData, userId)

      res.status(201).json({
        success: true,
        data: project,
      })
    } catch (error: unknown) {
      logger.error('Error creating project:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project'
      res.status(500).json({
        success: false,
        error: errorMessage,
      })
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const filters = {
        platform: req.query.platform as 'web' | 'app' | undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as 'resolved' | 'unresolved' | undefined,
        userId: req.query.userId as string | undefined,
      }

      // 썸네일 이미지 포함하여 조회
      const projects = await projectsService.getProjectsWithThumbnails(filters)

      res.json({
        success: true,
        data: projects,
      })
    } catch (error: unknown) {
      logger.error('Error fetching projects:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects'
      res.status(500).json({
        success: false,
        error: errorMessage,
      })
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params
      // 상세 정보 포함 (디자인 및 이미지)
      const project = await projectsService.getProjectByIdWithDetails(id)

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        })
      }

      res.json({
        success: true,
        data: project,
      })
    } catch (error: unknown) {
      logger.error('Error fetching project:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project'
      res.status(500).json({
        success: false,
        error: errorMessage,
      })
    }
  }

  /**
   * 프로젝트 삭제
   * DELETE /api/projects/:id
   */
  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        })
      }

      await projectsService.deleteProject(id, userId)

      res.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error: unknown) {
      logger.error('Error deleting project:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project'
      
      // 404 에러 처리
      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: errorMessage,
        })
      }
      
      // 403 에러 처리
      if (errorMessage.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: errorMessage,
        })
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
      })
    }
  }

  /**
   * 사용자가 피드백을 남긴 프로젝트 목록 조회
   * GET /api/projects/feedbacked
   */
  async getFeedbackedProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        })
      }

      const filters = {
        platform: req.query.platform as 'web' | 'app' | undefined,
      }

      const projects = await projectsService.getFeedbackedProjectsByUser(userId, filters)

      res.json({
        success: true,
        data: projects,
      })
    } catch (error: unknown) {
      logger.error('Error fetching feedbacked projects:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feedbacked projects'
      res.status(500).json({
        success: false,
        error: errorMessage,
      })
    }
  }
}

export const projectsController = new ProjectsController()

