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

export interface AuthUser {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

