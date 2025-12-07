import { supabaseAdmin } from '../config/supabase'
import { logger } from '../utils/logger'

export interface FeedbackQuestion {
  id: string
  project_id: string
  design_id: string | null
  question_text: string
  question_type: 'custom' | 'template'
  question_category: string | null
  display_order: number
  created_at: string
}

export interface CreateQuestionRequest {
  question_text: string
  question_type: 'custom' | 'template'
  question_category?: string
  design_id?: string
}

export class QuestionsService {
  /**
   * 피드백 질문 생성
   */
  async createQuestion(
    projectId: string,
    questionData: CreateQuestionRequest,
    designId?: string
  ): Promise<FeedbackQuestion> {
    const { data: question, error } = await supabaseAdmin
      .from('feedback_questions')
      .insert({
        project_id: projectId,
        design_id: designId || null,
        question_text: questionData.question_text,
        question_type: questionData.question_type || 'custom',
        question_category: questionData.question_category || null,
        display_order: 0, // TODO: 실제 display_order 계산
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`)
    }

    return question
  }

  /**
   * 여러 질문 생성
   */
  async createQuestions(
    projectId: string,
    questions: CreateQuestionRequest[],
    designId?: string
  ): Promise<FeedbackQuestion[]> {
    if (!questions || questions.length === 0) {
      return []
    }

    const questionsData = questions.map((q, index) => ({
      project_id: projectId,
      design_id: designId || null,
      question_text: q.question_text,
      question_type: q.question_type || 'custom',
      question_category: q.question_category || null,
      display_order: index,
    }))

    const { data, error } = await supabaseAdmin
      .from('feedback_questions')
      .insert(questionsData)
      .select()

    if (error) {
      throw new Error(`Failed to create questions: ${error.message}`)
    }

    return data || []
  }

  /**
   * 디자인별 질문 조회
   */
  async getQuestionsByDesign(designId: string): Promise<FeedbackQuestion[]> {
    const { data, error } = await supabaseAdmin
      .from('feedback_questions')
      .select('*')
      .eq('design_id', designId)
      .order('display_order', { ascending: true })

    if (error) {
      logger.error(`Failed to fetch questions for design ${designId}:`, error)
      return []
    }

    return data || []
  }

  /**
   * 프로젝트별 질문 조회
   */
  async getQuestionsByProject(projectId: string): Promise<FeedbackQuestion[]> {
    const { data, error } = await supabaseAdmin
      .from('feedback_questions')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true })

    if (error) {
      logger.error(`Failed to fetch questions for project ${projectId}:`, error)
      return []
    }

    return data || []
  }
}

export const questionsService = new QuestionsService()

