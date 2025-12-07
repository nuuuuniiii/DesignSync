const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 토큰 가져오기 함수
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// 안전한 JSON 파싱 헬퍼 함수
async function safeJsonParse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`)
  }
  
  try {
    return await response.json()
  } catch (error) {
    const text = await response.text()
    throw new Error(`Failed to parse JSON. Response: ${text.substring(0, 100)}`)
  }
}

export interface CreateDesignResponse {
  design: {
    id: string
    project_id: string
    name: string
    created_at: string
    updated_at: string
  }
  images: Array<{
    id: string
    design_id: string
    cloudinary_url: string
    cloudinary_public_id: string
    screen_number: number
    display_order: number
    created_at: string
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateDesignOptions {
  customQuestions?: string[]
  selectedQuestions?: string[]
  questionCategory?: string
}

/**
 * 디자인 생성 및 이미지 업로드 API
 */
export async function createDesignWithImages(
  projectId: string,
  designName: string,
  imageFiles: File[],
  options?: CreateDesignOptions
): Promise<ApiResponse<CreateDesignResponse>> {
  try {
    const token = getAuthToken()

    if (!token) {
      return {
        success: false,
        error: '인증이 필요합니다. 로그인해주세요.',
      }
    }

    // FormData 생성
    const formData = new FormData()
    formData.append('name', designName)

    // 이미지 파일 추가
    imageFiles.forEach((file) => {
      formData.append('images', file)
    })

    // 질문 데이터 추가
    if (options?.customQuestions && options.customQuestions.length > 0) {
      // 빈 문자열 제거
      const filteredQuestions = options.customQuestions.filter((q) => q.trim() !== '')
      if (filteredQuestions.length > 0) {
        formData.append('customQuestions', JSON.stringify(filteredQuestions))
      }
    }

    if (options?.selectedQuestions && options.selectedQuestions.length > 0) {
      formData.append('selectedQuestions', JSON.stringify(options.selectedQuestions))
    }

    if (options?.questionCategory) {
      formData.append('questionCategory', options.questionCategory)
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/designs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
      },
      body: formData,
    })

    const result = await safeJsonParse<ApiResponse<CreateDesignResponse>>(response)

    if (!response.ok) {
      // 401 에러인 경우 (토큰 만료)
      if (response.status === 401) {
        // 토큰 제거 및 이벤트 발생 (AuthContext에서 처리)
        localStorage.removeItem('auth_token')
        window.dispatchEvent(new Event('auth-token-expired'))
        return {
          success: false,
          error: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        }
      }
      return {
        success: false,
        error: result.error || '디자인 생성에 실패했습니다.',
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

