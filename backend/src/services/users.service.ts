import { supabaseAdmin } from '../config/supabase'

export interface User {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

export class UsersService {
  /**
   * 사용자가 존재하는지 확인하고, 없으면 생성
   */
  async getOrCreateUser(userId: string, email?: string, name?: string): Promise<User> {
    // 먼저 사용자가 존재하는지 확인 (id로)
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (existingUser) {
      return existingUser
    }

    // 이메일이 제공된 경우 이메일로도 확인
    if (email) {
      const { data: existingEmailUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (existingEmailUser) {
        // 같은 이메일이 있지만 다른 ID인 경우 에러
        if (existingEmailUser.id !== userId) {
          throw new Error(`Failed to create user: Email already exists with different user ID`)
        }
        return existingEmailUser
      }
    }

    // 사용자가 없으면 생성
    // UUID를 직접 지정하여 생성
    const userEmail = email || `temp-${userId.substring(0, 8)}@designsync.local`

    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: userEmail,
        name: name || 'Temp User',
      })
      .select()
      .single()

    if (createError) {
      // 중복 이메일 에러 처리
      if (createError.message.includes('duplicate') || createError.message.includes('unique') || createError.code === '23505') {
        throw new Error('이미 사용 중인 이메일입니다.')
      }
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    return newUser
  }

  /**
   * 이메일로 사용자 찾기 또는 생성
   */
  async getOrCreateUserByEmail(email: string, name?: string): Promise<User> {
    // 먼저 이메일로 사용자 찾기
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return existingUser
    }

    // 사용자가 없으면 생성
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name: name || email.split('@')[0],
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    return newUser
  }
}

export const usersService = new UsersService()
