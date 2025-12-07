import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout/Layout'
import { Input } from '@/components/Input/Input'
import { Select } from '@/components/Select/Select'
import { Button } from '@/components/Button/Button'
import './signup-page.css'

/**
 * 회원가입 페이지
 */
export const SignUpPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    company: '',
    careerYears: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const careerYearOptions = [
    { value: '', label: '경력을 선택하세요' },
    { value: '0', label: '신입 (0년)' },
    { value: '1', label: '1년차' },
    { value: '2', label: '2년차' },
    { value: '3', label: '3년차' },
    { value: '4', label: '4년차' },
    { value: '5', label: '5년차' },
    { value: '6', label: '6년차' },
    { value: '7', label: '7년차' },
    { value: '8', label: '8년차' },
    { value: '9', label: '9년차' },
    { value: '10', label: '10년 이상' },
  ]

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    // 최소 8자, 영문, 숫자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.'
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.'
    }

    if (!formData.company.trim()) {
      newErrors.company = '회사명을 입력해주세요.'
    }

    if (!formData.careerYears) {
      newErrors.careerYears = '경력을 선택해주세요.'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
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
      const result = await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        company: formData.company,
        careerYears: formData.careerYears,
      })

      if (result.success) {
        // 회원가입 성공 시 홈으로 이동
        navigate('/explore')
      } else {
        setErrors({ submit: result.error || '회원가입에 실패했습니다.' })
        setIsLoading(false)
      }
    } catch (error: unknown) {
      console.error('Sign up error:', error)
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
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
  }

  return (
    <Layout>
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <h1>회원가입</h1>
            <p>DesignSync에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <Input
              id="email"
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@email.com"
              error={errors.email}
              required
            />

            <Input
              id="nickname"
              label="닉네임"
              type="text"
              value={formData.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
              placeholder="닉네임을 입력하세요"
              error={errors.nickname}
              required
            />

            <Input
              id="company"
              label="회사명"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="회사명을 입력하세요"
              error={errors.company}
              required
            />

            <Select
              id="careerYears"
              label="경력"
              options={careerYearOptions}
              value={formData.careerYears}
              onChange={(e) => handleChange('careerYears', e.target.value)}
              error={errors.careerYears}
              required
            />

            <Input
              id="password"
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="8자 이상, 영문과 숫자 포함"
              error={errors.password}
              required
            />

            <Input
              id="confirmPassword"
              label="비밀번호 확인"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.confirmPassword}
              required
            />

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <div className="signup-actions">
              <Button type="submit" variant="primary" size="large" disabled={isLoading}>
                {isLoading ? '회원가입 중...' : '회원가입'}
              </Button>
            </div>

            <div className="signup-footer">
              <p>
                이미 계정이 있으신가요? <Link to="/sign-in">로그인</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

