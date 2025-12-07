import { supabaseAdmin } from '../config/supabase'
import { Project, CreateProjectRequest } from '../types/project.types'
import { usersService } from './users.service'
import { questionsService } from './questions.service'
import { feedbacksService } from './feedbacks.service'
import { logger } from '../utils/logger'

export interface ProjectWithDetails extends Project {
  feedback_types?: string[]
  average_ratings?: Record<string, number> // feedback_type -> average rating
  designs?: Array<{
    id: string
    name: string
    images: Array<{
      id: string
      cloudinary_url: string
      screen_number: number
      display_order: number
    }>
    questions?: Array<{
      id: string
      question_text: string
      question_type: 'custom' | 'template'
      question_category: string | null
      display_order: number
      feedbacks?: Array<{
        id: string
        screen_number: number | null
        feedback_text: string
        user_name: string | null
        created_at: string
      }>
    }>
  }>
}

export class ProjectsService {
  async createProject(data: CreateProjectRequest, userId: string): Promise<Project> {
    // 1. 사용자가 존재하는지 확인하고, 없으면 생성
    await usersService.getOrCreateUser(userId)

    // 2. 프로젝트 생성
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description || null,
        platform: data.platform,
        category: data.category,
        status: 'unresolved',
      })
      .select()
      .single()

    if (projectError) {
      throw new Error(`Failed to create project: ${projectError.message}`)
    }

    // 3. 피드백 타입 저장
    if (data.feedback_types && data.feedback_types.length > 0) {
      const feedbackTypesData = data.feedback_types.map((type) => ({
        project_id: project.id,
        feedback_type: type,
      }))

      const { error: typesError } = await supabaseAdmin
        .from('project_feedback_types')
        .insert(feedbackTypesData)

      if (typesError) {
        // 프로젝트는 생성되었지만 피드백 타입 저장 실패 시 프로젝트 삭제
        await supabaseAdmin.from('projects').delete().eq('id', project.id)
        throw new Error(`Failed to save feedback types: ${typesError.message}`)
      }
    }

    // 4. 디자인 및 질문은 별도 API로 처리 (이미지 업로드 포함)
    // TODO: 디자인 생성 API 구현

    return project
  }

  async getProjects(filters?: {
    platform?: 'web' | 'app'
    category?: string
    status?: 'resolved' | 'unresolved'
    userId?: string
  }): Promise<Project[]> {
    let query = supabaseAdmin.from('projects').select('*')

    if (filters?.platform) {
      query = query.eq('platform', filters.platform)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }
    return data || []
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw new Error(`Failed to fetch project: ${error.message}`)
    }
    return data
  }

  /**
   * 프로젝트 상세 정보 조회 (디자인 및 이미지 포함)
   */
  async getProjectByIdWithDetails(id: string): Promise<ProjectWithDetails | null> {
    try {
      // 1. 프로젝트 기본 정보 가져오기
      const project = await this.getProjectById(id)
      if (!project) {
        return null
      }

      // 2. 피드백 타입 가져오기
      let feedbackTypesList: string[] = []
      try {
        const { data: feedbackTypes, error: feedbackTypesError } = await supabaseAdmin
          .from('project_feedback_types')
          .select('feedback_type')
          .eq('project_id', id)

        feedbackTypesList = feedbackTypesError || !feedbackTypes
          ? []
          : feedbackTypes.map((ft) => ft.feedback_type)
      } catch (error: any) {
        logger.error(`Failed to fetch feedback types for project ${id}:`, error)
        feedbackTypesList = []
      }

      // 3. 디자인 및 이미지 정보 가져오기
      let designsWithImagesAndQuestions: Array<{
        id: string
        name: string
        images: Array<{
          id: string
          cloudinary_url: string
          screen_number: number
          display_order: number
        }>
        questions?: Array<{
          id: string
          question_text: string
          question_type: 'custom' | 'template'
          question_category: string | null
          display_order: number
        }>
      }> = []

      try {
        const { data: designs, error: designsError } = await supabaseAdmin
          .from('designs')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true })

        if (designsError) {
          logger.error(`Failed to fetch designs for project ${id}:`, designsError)
          designsWithImagesAndQuestions = []
        } else if (designs && designs.length > 0) {
          // 4. 각 디자인별 이미지 및 질문 정보 가져오기
          designsWithImagesAndQuestions = await Promise.all(
            designs.map(async (design) => {
              // 이미지 정보 가져오기
              const { data: images, error: imagesError } = await supabaseAdmin
                .from('design_images')
                .select('id, cloudinary_url, screen_number, display_order')
                .eq('design_id', design.id)
                .order('display_order', { ascending: true })

              // 질문 정보 가져오기
              const questions = await questionsService.getQuestionsByDesign(design.id)

              // 각 질문별 피드백 가져오기
              const questionsWithFeedbacks = await Promise.all(
                questions.map(async (q) => {
                  try {
                    const feedbacks = await feedbacksService.getFeedbacksByDesignAndQuestion(design.id, q.id)
                    return {
                      id: q.id,
                      question_text: q.question_text,
                      question_type: q.question_type,
                      question_category: q.question_category,
                      display_order: q.display_order,
                      feedbacks: feedbacks.map((fb) => ({
                        id: fb.id,
                        screen_number: fb.screen_number,
                        feedback_text: fb.feedback_text,
                        user_id: fb.user_id,
                        user_name: fb.user_name,
                        created_at: fb.created_at,
                      })),
                    }
                  } catch (error: any) {
                    logger.error(`Failed to fetch feedbacks for question ${q.id}:`, error)
                    return {
                      id: q.id,
                      question_text: q.question_text,
                      question_type: q.question_type,
                      question_category: q.question_category,
                      display_order: q.display_order,
                      feedbacks: [],
                    }
                  }
                })
              )

              return {
                id: design.id,
                name: design.name,
                images: imagesError || !images ? [] : images,
                questions: questionsWithFeedbacks,
              }
            })
          )
        }
      } catch (error: any) {
        logger.error(`Failed to fetch designs for project ${id}:`, error)
        designsWithImagesAndQuestions = []
      }

      // 4. Rating 평균 계산
      let averageRatings: Record<string, number> = {}
      try {
        averageRatings = await feedbacksService.getAverageRatingsByProject(id)
      } catch (error: any) {
        logger.error(`Failed to fetch average ratings for project ${id}:`, error)
        averageRatings = {}
      }

      // 빈 배열이라도 항상 포함하여 반환 (명시적으로 필드 설정)
      const result: ProjectWithDetails = {
        id: project.id,
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        platform: project.platform,
        category: project.category,
        status: project.status,
        created_at: project.created_at,
        updated_at: project.updated_at,
        feedback_types: Array.isArray(feedbackTypesList) ? feedbackTypesList : [],
        average_ratings: averageRatings,
        designs: Array.isArray(designsWithImagesAndQuestions) ? designsWithImagesAndQuestions : [],
      }
      
      // 디버깅: 반환 데이터 확인
      console.log('🔍 [Backend] getProjectByIdWithDetails 반환:', {
        projectId: id,
        hasFeedbackTypes: !!result.feedback_types,
        feedbackTypesCount: result.feedback_types?.length || 0,
        feedbackTypes: result.feedback_types,
        hasDesigns: !!result.designs,
        designsCount: result.designs?.length || 0,
        resultKeys: Object.keys(result),
      })
      
      return result
    } catch (error: any) {
      logger.error(`Error in getProjectByIdWithDetails for project ${id}:`, error)
      throw error
    }
  }

  /**
   * 프로젝트 목록 조회 시 썸네일 이미지 URL 포함
   */
  async getProjectsWithThumbnails(filters?: {
    platform?: 'web' | 'app'
    category?: string
    status?: 'resolved' | 'unresolved'
    userId?: string
  }): Promise<(Project & { thumbnail_url?: string })[]> {
    const projects = await this.getProjects(filters)

    // 각 프로젝트의 썸네일 이미지 가져오기
    const projectsWithThumbnails = await Promise.all(
      projects.map(async (project) => {
        try {
          // 프로젝트의 첫 번째 디자인의 첫 번째 이미지 가져오기
          const { data: designs, error: designsError } = await supabaseAdmin
            .from('designs')
            .select('id')
            .eq('project_id', project.id)
            .order('created_at', { ascending: true })
            .limit(1)

          if (designsError || !designs || designs.length === 0) {
            return { ...project, thumbnail_url: undefined }
          }

          const designId = designs[0].id

          const { data: images, error: imagesError } = await supabaseAdmin
            .from('design_images')
            .select('cloudinary_url')
            .eq('design_id', designId)
            .order('display_order', { ascending: true })
            .limit(1)

          if (imagesError || !images || images.length === 0) {
            return { ...project, thumbnail_url: undefined }
          }

          return {
            ...project,
            thumbnail_url: images[0].cloudinary_url,
          }
        } catch (error) {
          return { ...project, thumbnail_url: undefined }
        }
      })
    )

    return projectsWithThumbnails
  }
}

export const projectsService = new ProjectsService()
