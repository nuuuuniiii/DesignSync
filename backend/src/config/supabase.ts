import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Service role key를 사용하는 Admin 클라이언트 (서버 사이드에서만 사용)
// 이 클라이언트는 RLS(Row Level Security) 정책을 우회할 수 있습니다.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Anon key를 사용하는 클라이언트 (Auth 기능 사용)
// 인증이 필요한 API에서 사용합니다.
export const supabaseAuth = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// 일반 클라이언트 (기본값: Service Role Key)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

