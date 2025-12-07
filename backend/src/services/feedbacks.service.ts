import { supabaseAdmin } from '../config/supabase'
import { logger } from '../utils/logger'

export interface CreateFeedbackRequest {
  project_id: string
  user_id: string
  ratings: Record<string, number> // feedback type id -> rating (1-5)
  feedbacks: Array<{
    design_id: string
    question_id: string
    screen_number: number | null
    feedback_text: string
  }>
}

export interface Feedback {
  id: string
  project_id: string
  user_id: string | null
  design_id: string | null
  question_id: string | null
  screen_number: number | null
  feedback_text: string
  created_at: string
  updated_at: string
  user_name?: string | null
}

export interface FeedbackRating {
  feedback_id: string
  feedback_type: string
  rating: number
}

// 피드백 타입 ID를 이름으로 변환
const getFeedbackTypeName = (typeId: string): string => {
  const typeMap: Record<string, string> = {
    'user-flow': 'User Flow',
    'ux-writing': 'UX Writing',
    'interaction-design': 'Interaction Design',
    'information-architecture': 'Information Architecture',
    'visual-design': 'Visual Design',
    'usability': 'Usability',
  }
  return typeMap[typeId] || typeId
}

export class FeedbacksService {
  /**
   * 피드백 생성 (ratings + screen feedbacks)
   */
  async createFeedback(data: CreateFeedbackRequest): Promise<{ feedback_id: string }> {
    try {
      // 1. 피드백 레코드 생성 (첫 번째 피드백 텍스트를 메인으로 사용)
      const firstFeedback = data.feedbacks[0]
      if (!firstFeedback) {
        throw new Error('At least one feedback text is required')
      }

      // 2. 각 질문별로 피드백 생성
      const feedbackIds: string[] = []

      for (const feedbackData of data.feedbacks) {
        if (!feedbackData.feedback_text || feedbackData.feedback_text.trim() === '') {
          continue // 빈 피드백은 건너뛰기
        }

        const { data: feedback, error: feedbackError } = await supabaseAdmin
          .from('feedbacks')
          .insert({
            project_id: data.project_id,
            user_id: data.user_id,
            design_id: feedbackData.design_id,
            question_id: feedbackData.question_id,
            screen_number: feedbackData.screen_number,
            feedback_text: feedbackData.feedback_text,
          })
          .select()
          .single()

        if (feedbackError) {
          logger.error('Failed to create feedback:', feedbackError)
          throw new Error(`Failed to create feedback: ${feedbackError.message}`)
        }

        if (feedback) {
          feedbackIds.push(feedback.id)
        }
      }

      if (feedbackIds.length === 0) {
        throw new Error('No valid feedbacks were created')
      }

      // 3. 모든 피드백에 대해 ratings 추가 (첫 번째 피드백 ID에만 연결)
      const mainFeedbackId = feedbackIds[0]

      for (const [typeId, rating] of Object.entries(data.ratings)) {
        if (rating > 0) {
          // rating이 0보다 큰 경우에만 저장
          const feedbackTypeName = getFeedbackTypeName(typeId)

          const { error: ratingError } = await supabaseAdmin
            .from('feedback_ratings')
            .insert({
              feedback_id: mainFeedbackId,
              feedback_type: feedbackTypeName,
              rating: rating,
            })

          if (ratingError) {
            logger.error('Failed to create feedback rating:', ratingError)
            // Rating 실패는 로그만 남기고 계속 진행
          }
        }
      }

      return { feedback_id: mainFeedbackId }
    } catch (error: unknown) {
      logger.error('Error in createFeedback:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to create feedback')
    }
  }

  /**
   * 프로젝트의 피드백 목록 조회
   */
  async getFeedbacksByProject(projectId: string): Promise<Feedback[]> {
    try {
      const { data: feedbacks, error } = await supabaseAdmin
        .from('feedbacks')
        .select(`
          id,
          project_id,
          user_id,
          design_id,
          question_id,
          screen_number,
          feedback_text,
          created_at,
          updated_at,
          users:user_id (
            name
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Failed to fetch feedbacks:', error)
        throw new Error(`Failed to fetch feedbacks: ${error.message}`)
      }

      // users 정보 추출
      return (feedbacks || []).map((fb) => ({
        id: fb.id,
        project_id: fb.project_id,
        user_id: fb.user_id,
        design_id: fb.design_id,
        question_id: fb.question_id,
        screen_number: fb.screen_number,
        feedback_text: fb.feedback_text,
        created_at: fb.created_at,
        updated_at: fb.updated_at,
        user_name: fb.users?.name || null,
      }))
    } catch (error: unknown) {
      logger.error('Error in getFeedbacksByProject:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch feedbacks')
    }
  }

  /**
   * 디자인별, 질문별 피드백 조회
   */
  async getFeedbacksByDesignAndQuestion(designId: string, questionId: string): Promise<Feedback[]> {
    try {
      const { data: feedbacks, error } = await supabaseAdmin
        .from('feedbacks')
        .select(`
          id,
          project_id,
          user_id,
          design_id,
          question_id,
          screen_number,
          feedback_text,
          created_at,
          updated_at,
          users:user_id (
            name
          )
        `)
        .eq('design_id', designId)
        .eq('question_id', questionId)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Failed to fetch feedbacks:', error)
        throw new Error(`Failed to fetch feedbacks: ${error.message}`)
      }

      return (feedbacks || []).map((fb) => ({
        id: fb.id,
        project_id: fb.project_id,
        user_id: fb.user_id,
        design_id: fb.design_id,
        question_id: fb.question_id,
        screen_number: fb.screen_number,
        feedback_text: fb.feedback_text,
        created_at: fb.created_at,
        updated_at: fb.updated_at,
        user_name: fb.users?.name || null,
      }))
    } catch (error: unknown) {
      logger.error('Error in getFeedbacksByDesignAndQuestion:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch feedbacks')
    }
  }

  /**
   * 프로젝트의 모든 피드백 rating 평균 계산
   */
  async getAverageRatingsByProject(projectId: string): Promise<Record<string, number>> {
    try {
      // 1. 프로젝트의 모든 피드백 ID 가져오기
      const { data: feedbacks, error: feedbacksError } = await supabaseAdmin
        .from('feedbacks')
        .select('id')
        .eq('project_id', projectId)

      if (feedbacksError || !feedbacks || feedbacks.length === 0) {
        return {}
      }

      const feedbackIds = feedbacks.map((fb) => fb.id)

      // 2. 모든 피드백의 rating 가져오기
      const { data: ratings, error: ratingsError } = await supabaseAdmin
        .from('feedback_ratings')
        .select('feedback_type, rating')
        .in('feedback_id', feedbackIds)

      if (ratingsError || !ratings || ratings.length === 0) {
        return {}
      }

      // 3. feedback_type별로 평균 계산
      const ratingMap: Record<string, number[]> = {}
      
      for (const rating of ratings) {
        if (!ratingMap[rating.feedback_type]) {
          ratingMap[rating.feedback_type] = []
        }
        ratingMap[rating.feedback_type].push(rating.rating)
      }

      // 4. 평균 계산
      const averages: Record<string, number> = {}
      for (const [feedbackType, ratingValues] of Object.entries(ratingMap)) {
        const sum = ratingValues.reduce((acc, val) => acc + val, 0)
        const average = sum / ratingValues.length
        averages[feedbackType] = Math.round(average * 10) / 10 // 소수점 첫째자리까지
      }

      return averages
    } catch (error: unknown) {
      logger.error('Error in getAverageRatingsByProject:', error)
      return {}
    }
  }
}

export const feedbacksService = new FeedbacksService()

