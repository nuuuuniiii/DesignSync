import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout/Layout'
import { Input } from '@/components/Input/Input'
import { Button } from '@/components/Button/Button'
import './signin-page.css'

/**
 * 로그인 페이지
 */
export const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        // 로그인 성공 시 원래 페이지로 이동 (또는 홈)
        const from = (location.state as { from?: string } | null)?.from || '/explore'
        navigate(from)
      } else {
        setErrors({ submit: result.error || '이메일 또는 비밀번호가 올바르지 않습니다.' })
        setIsLoading(false)
      }
    } catch (error: unknown) {
      console.error('Sign in error:', error)
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
      setErrors({ submit: errorMessage })
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    // submit 에러도 초기화
    if (errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.submit
        return newErrors
      })
    }
  }

  return (
    <Layout>
      <div className="signin-page">
        <div className="signin-container">
          <div className="signin-header">
            <h1>로그인</h1>
            <p>DesignSync에 다시 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            <Input
              id="email"
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@email.com"
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="비밀번호를 입력하세요"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <div className="signin-actions">
              <Button type="submit" variant="primary" size="large" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>

            <div className="signin-footer">
              <p>
                계정이 없으신가요? <Link to="/sign-up">회원가입</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

