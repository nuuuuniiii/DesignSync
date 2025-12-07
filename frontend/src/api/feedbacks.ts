const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 토큰 가져오기 함수
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// 인증 헤더 생성
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export interface CreateFeedbackRequest {
  project_id: string
  ratings: Record<string, number> // feedback type id -> rating (1-5)
  feedbacks: Array<{
    design_id: string
    question_id: string
    screen_number: number | null
    feedback_text: string
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 피드백 생성 API
 */
export async function createFeedback(
  data: CreateFeedbackRequest
): Promise<ApiResponse<{ feedback_id: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '피드백 생성에 실패했습니다.',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.'
    return {
      success: false,
      error: errorMessage,
    }
  }
}

