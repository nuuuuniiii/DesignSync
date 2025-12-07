import { supabaseAdmin, supabaseAuth } from '../config/supabase'
import { SignUpRequest, SignInRequest, AuthResponse, AuthUser } from '../types/auth.types'
import { usersService } from './users.service'

export class AuthService {
  /**
   * 회원가입
   */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    if (!supabaseAuth) {
      throw new Error('Supabase Auth is not configured. Please set SUPABASE_ANON_KEY in .env')
    }

    // 0. 이메일 중복 확인 (users 테이블에서)
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', data.email)
      .maybeSingle()

    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.')
    }

    // 1. Supabase Auth로 사용자 생성
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nickname: data.nickname || null,
          company: data.company || null,
          career_years: data.careerYears || null,
        },
      },
    })

    if (authError) {
      // 이메일 중복 에러 처리
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        throw new Error('이미 사용 중인 이메일입니다.')
      }
      throw new Error(`Failed to sign up: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to create user: No user data returned')
    }

    const userId = authData.user.id

    // 2. users 테이블에 사용자 정보 저장 (중복 체크 포함)
    try {
      const user = await usersService.getOrCreateUser(
        userId,
        data.email,
        data.nickname || data.email.split('@')[0]
      )

      // 3. Access token 반환
      const accessToken = authData.session?.access_token || ''

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
        },
        access_token: accessToken,
      }
    } catch (error) {
      // users 테이블 저장 실패 시 (중복 등) 명확한 에러 메시지
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user'
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        throw new Error('이미 사용 중인 이메일입니다.')
      }
      throw error
    }
  }

  /**
   * 로그인
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    if (!supabaseAuth) {
      throw new Error('Supabase Auth is not configured. Please set SUPABASE_ANON_KEY in .env')
    }

    // 1. 이메일/비밀번호로 로그인
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      throw new Error(`Failed to sign in: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to sign in: No user data returned')
    }

    const userId = authData.user.id

    // 2. users 테이블에서 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      // users 테이블에 없으면 생성
      await usersService.getOrCreateUser(userId, data.email)
      const newUser = await usersService.getOrCreateUser(userId, data.email)
      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || undefined,
        },
        access_token: authData.session?.access_token || '',
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      },
      access_token: authData.session?.access_token || '',
    }
  }

  /**
   * JWT 토큰으로 사용자 정보 조회
   */
  async getUserByToken(token: string): Promise<AuthUser | null> {
    if (!supabaseAuth) {
      throw new Error('Supabase Auth is not configured. Please set SUPABASE_ANON_KEY in .env')
    }

    // 토큰 검증
    const {
      data: { user: authUser },
      error,
    } = await supabaseAuth.auth.getUser(token)

    if (error || !authUser) {
      return null
    }

    // users 테이블에서 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (userError || !user) {
      return null
    }

    return user
  }
}

export const authService = new AuthService()

