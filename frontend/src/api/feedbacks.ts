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

// 안전한 JSON 파싱 헬퍼 함수
async function safeJsonParse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    
    // 404 에러인 경우 더 명확한 메시지 제공
    if (response.status === 404) {
      throw new Error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`)
  }
  
  try {
    return await response.json()
  } catch (error) {
    const text = await response.text()
    throw new Error(`Failed to parse JSON. Response: ${text.substring(0, 100)}`)
  }
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
    // 토큰 확인
    const token = getAuthToken()
    if (!token) {
      return {
        success: false,
        error: '로그인이 필요합니다. 로그인 후 다시 시도해주세요.',
      }
    }

    const response = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await safeJsonParse<ApiResponse<{ feedback_id: string }>>(response)

    if (!response.ok) {
      // 401 에러인 경우 (토큰 만료)
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        window.dispatchEvent(new Event('auth-token-expired'))
        return {
          success: false,
          error: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        }
      }
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

