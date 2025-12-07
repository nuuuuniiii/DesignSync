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
      const userId = (req as any).user?.id

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
    } catch (error: any) {
      logger.error('Error creating project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create project',
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
    } catch (error: any) {
      logger.error('Error fetching projects:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch projects',
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
    } catch (error: any) {
      logger.error('Error fetching project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch project',
      })
    }
  }
}

export const projectsController = new ProjectsController()

