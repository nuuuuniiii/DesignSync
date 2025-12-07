// Supabase 쿼리 결과 타입 정의

export interface SupabaseFeedbackWithUser {
  id: string
  project_id: string
  user_id: string
  design_id: string | null
  question_id: string | null
  screen_number: number | null
  feedback_text: string
  created_at: string
  updated_at: string
  users?: {
    name: string | null
  } | null
}

