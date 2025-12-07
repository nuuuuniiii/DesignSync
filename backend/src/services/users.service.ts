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
    // 먼저 사용자가 존재하는지 확인
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (existingUser) {
      return existingUser
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
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    return newUser
  }

  /**
   * 이메일로 사용자 찾기 또는 생성
   */
  async getOrCreateUserByEmail(email: string, name?: string): Promise<User> {
    // 먼저 이메일로 사용자 찾기
    const { data: existingUser, error: fetchError } = await supabaseAdmin
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
