const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 토큰 가져오기 함수 (auth.ts에서 import)
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
  thumbnail_url?: string
}

export interface ProjectWithDetails extends Project {
  feedback_types?: string[]
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
    }>
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 카테고리를 데이터베이스 형식으로 변환
 */
const mapCategoryToDBFormat = (category: string): string => {
  const categoryMap: Record<string, string> = {
    ecommerce: 'E-Commerce',
    business: 'Business',
    lifestyle: 'Lifestyle',
    media: 'Media',
    finance: 'Finance',
    technology: 'Technology',
    social: 'Social',
    government: 'Government',
    entertainment: 'Entertainment',
    wellness: 'Wellness',
    education: 'Education',
    travel: 'Travel',
  }
  return categoryMap[category.toLowerCase()] || category
}

/**
 * 프로젝트 생성 API
 */
export async function createProject(
  projectData: CreateProjectRequest
): Promise<ApiResponse<Project>> {
  try {
    // 카테고리를 데이터베이스 형식으로 변환
    const requestData = {
      ...projectData,
      category: mapCategoryToDBFormat(projectData.category),
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

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
        error: result.error || '프로젝트 생성에 실패했습니다.',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '네트워크 오류가 발생했습니다.',
    }
  }
}

/**
 * 프로젝트 목록 조회 API
 */
export async function getProjects(filters?: {
  platform?: 'web' | 'app'
  category?: string
  status?: 'resolved' | 'unresolved'
  userId?: string
}): Promise<ApiResponse<Project[]>> {
  try {
    const queryParams = new URLSearchParams()
    if (filters?.platform) queryParams.append('platform', filters.platform)
    if (filters?.category) queryParams.append('category', filters.category)
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.userId) queryParams.append('userId', filters.userId)

    const url = `${API_BASE_URL}/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '프로젝트 목록을 가져오는데 실패했습니다.',
      }
    }

    return {
      success: true,
      data: result.data || [],
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '네트워크 오류가 발생했습니다.',
    }
  }
}

/**
 * 프로젝트 상세 조회 API
 */
export async function getProjectById(id: string): Promise<ApiResponse<ProjectWithDetails>> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    
    // 디버깅: API 응답 전체 확인
    console.log('📡 API 응답 전체:', result)
    console.log('📡 API 응답 data:', result.data)
    if (result.data) {
      console.log('📡 data의 키:', Object.keys(result.data))
      console.log('📡 feedback_types:', result.data.feedback_types)
      console.log('📡 designs:', result.data.designs)
    }

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '프로젝트를 가져오는데 실패했습니다.',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '네트워크 오류가 발생했습니다.',
    }
  }
}
