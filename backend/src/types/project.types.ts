export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  platform: 'web' | 'app'
  category: string
  status: 'resolved' | 'unresolved'
  created_at: string
  updated_at: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  platform: 'web' | 'app'
  category: string
  feedback_types: string[]
  designs?: CreateDesignRequest[]
  questions?: CreateQuestionRequest[]
}

export interface CreateDesignRequest {
  name: string
  images?: File[]
}

export interface CreateQuestionRequest {
  question_text: string
  question_type: 'custom' | 'template'
  question_category?: string
  design_id?: string
}

