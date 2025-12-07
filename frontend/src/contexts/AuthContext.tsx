import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signIn, signUp, signOut as apiSignOut, getCurrentUser, getToken, AuthResponse } from '@/api/auth'
import { SignUpRequest, SignInRequest } from '@/api/auth'

interface AuthContextType {
  user: AuthResponse['user'] | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: SignInRequest) => Promise<{ success: boolean; error?: string }>
  register: (data: SignUpRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()
      if (token) {
        // 토큰이 있으면 사용자 정보 조회
        const result = await getCurrentUser()
        if (result.success && result.data) {
          setUser(result.data)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: SignInRequest) => {
    setIsLoading(true)
    try {
      const result = await signIn(data)
      if (result.success && result.data) {
        setUser(result.data.user)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: result.error }
      }
    } catch (error: unknown) {
      setIsLoading(false)
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (data: SignUpRequest) => {
    setIsLoading(true)
    try {
      const result = await signUp(data)
      if (result.success && result.data) {
        setUser(result.data.user)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: result.error }
      }
    } catch (error: unknown) {
      setIsLoading(false)
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    apiSignOut()
    setUser(null)
  }

  const refreshUser = async () => {
    const result = await getCurrentUser()
    if (result.success && result.data) {
      setUser(result.data)
    } else {
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

