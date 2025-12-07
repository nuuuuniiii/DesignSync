const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

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

export interface SignUpRequest {
  email: string
  password: string
  nickname?: string
  company?: string
  careerYears?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name?: string
  }
  access_token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

/**
 * 로컬스토리지에 토큰 저장
 */
export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token)
}

/**
 * 로컬스토리지에서 토큰 제거
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token')
}

/**
 * 회원가입 API
 */
export async function signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await safeJsonParse<ApiResponse<AuthResponse>>(response)

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '회원가입에 실패했습니다.',
      }
    }

    // 토큰 저장
    if (result.data?.access_token) {
      setToken(result.data.access_token)
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

/**
 * 로그인 API
 */
export async function signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await safeJsonParse<ApiResponse<AuthResponse>>(response)

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '로그인에 실패했습니다.',
      }
    }

    // 토큰 저장
    if (result.data?.access_token) {
      setToken(result.data.access_token)
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

/**
 * 현재 로그인한 사용자 정보 조회 API
 */
export async function getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      }
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await safeJsonParse<ApiResponse<AuthResponse['user']>>(response)

    if (!response.ok) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      if (response.status === 401) {
        removeToken()
      }
      return {
        success: false,
        error: result.error || '사용자 정보를 가져오는데 실패했습니다.',
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

/**
 * 로그아웃
 */
export function signOut(): void {
  removeToken()
}

