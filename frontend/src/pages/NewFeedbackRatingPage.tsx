import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { getProjectById, ProjectWithDetails } from '@/api/projects'
import './new-feedback-rating.css'

// 피드백 타입 이름을 ID로 변환하는 함수
const getFeedbackTypeId = (typeName: string): string | null => {
  const typeMap: Record<string, string> = {
    'User Flow': 'user-flow',
    'UX Writing': 'ux-writing',
    'Interaction Design': 'interaction-design',
    'Information Architecture': 'information-architecture',
    'Visual Design': 'visual-design',
    'Usability': 'usability',
  }
  return typeMap[typeName] || null
}

/**
 * New Feedback Rating 화면
 *
 * Figma 디자인:
 * - https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=76-7845&m=dev
 */
export const NewFeedbackRatingPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단
  const isApp = !location.pathname.includes('/web')
  
  const [project, setProject] = useState<ProjectWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('프로젝트 ID가 없습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await getProjectById(projectId)
        
        if (result.success && result.data) {
          const projectData = result.data as ProjectWithDetails
          setProject(projectData)
          
          // 선택한 피드백 타입만으로 ratings 초기화
          const selectedFeedbackTypes = projectData.feedback_types || []
          const initialRatings: Record<string, number> = {}
          
          selectedFeedbackTypes.forEach((type) => {
            const typeId = getFeedbackTypeId(type)
            if (typeId) {
              initialRatings[typeId] = 0
            }
          })
          
          setRatings(initialRatings)
        } else {
          setError(result.error || '프로젝트를 불러오는데 실패했습니다.')
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  // 모든 가능한 피드백 타입 정의
  const allRatingTypes = [
    {
      id: 'user-flow',
      name: 'User Flow',
      description: 'How easily users can move through the steps to complete a task, and whether the process feels clear and intuitive.',
    },
    {
      id: 'ux-writing',
      name: 'UX Writing',
      description: 'How clear, concise, and helpful the text is in guiding users through the interface.',
    },
    {
      id: 'interaction-design',
      name: 'Interaction Design',
      description: 'How well the system responds to user actions, including feedback, controls, and overall interactive behavior.',
    },
    {
      id: 'information-architecture',
      name: 'Information Architecture',
      description: 'How logically the information is organized and whether users can find what they need without confusion.',
    },
    {
      id: 'visual-design',
      name: 'Visual Design',
      description: 'How effectively layout, colors, typography, and visual hierarchy help users understand and use the interface.',
    },
    {
      id: 'usability',
      name: 'Usability',
      description: 'How easy, efficient, and error-free it is for users to accomplish their goals.',
    },
  ]

  // 프로젝트에서 선택한 피드백 타입만 필터링
  const selectedFeedbackTypes = project?.feedback_types || []
  const ratingTypes = allRatingTypes.filter((type) => 
    selectedFeedbackTypes.includes(type.name)
  )

  const leftRatings = ratingTypes.slice(0, Math.ceil(ratingTypes.length / 2))
  const rightRatings = ratingTypes.slice(Math.ceil(ratingTypes.length / 2))

  const handleRatingChange = (typeId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [typeId]: value,
    }))
  }

  const handleNext = () => {
    console.log('Next button clicked, projectId:', projectId)
    if (!projectId) {
      console.error('Project ID is missing')
      return
    }
    const webPath = location.pathname.includes('/web') ? '/web' : ''
    console.log('Navigating to screen page with projectId:', projectId)
    navigate(`/projects/${projectId}${webPath}/feedback/screen`, { state: { ratings } })
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="new-feedback-rating-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (error || !project) {
    return (
      <div className="new-feedback-rating-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
          {error || '프로젝트를 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  return (
    <div className="new-feedback-rating-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      <div className="new-feedback-rating-content">
        <div className="new-feedback-header">
          <h1 className="new-feedback-title">New Feedback</h1>
        </div>

        {/* Project Section */}
        <div className="project-section">
          <div className="project-header">
            <p className="project-name">{project.name}</p>
          </div>
          <div className="project-platform-field">
            <div className="platform-tag">{isApp ? 'App' : 'Web'}</div>
            <p className="project-description">{project.description || ''}</p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="rating-section-wrapper">
          <div className="rating-section">
            <p className="rating-section-label">Ratings</p>
            {ratingTypes.length > 0 ? (
              <div className="ratings-container">
                {/* Left Column */}
                <div className="ratings-column">
                  {leftRatings.map((rating, index) => (
                    <React.Fragment key={rating.id}>
                      <div className="rating-block">
                        <div className="rating-info">
                          <p className="rating-name">{rating.name}</p>
                          <p className="rating-description">{rating.description}</p>
                        </div>
                        <div className="rating-slider-wrapper">
                          <RatingSlider
                            value={ratings[rating.id] || 0}
                            onChange={(value) => handleRatingChange(rating.id, value)}
                          />
                        </div>
                      </div>
                      {index < leftRatings.length - 1 && <div className="section-divider-line"></div>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Right Column */}
                <div className="ratings-column">
                  {rightRatings.map((rating, index) => (
                    <React.Fragment key={rating.id}>
                      <div className="rating-block">
                        <div className="rating-info">
                          <p className="rating-name">{rating.name}</p>
                          <p className="rating-description">{rating.description}</p>
                        </div>
                        <div className="rating-slider-wrapper">
                          <RatingSlider
                            value={ratings[rating.id] || 0}
                            onChange={(value) => handleRatingChange(rating.id, value)}
                          />
                        </div>
                      </div>
                      {index < rightRatings.length - 1 && <div className="section-divider-line"></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                선택된 피드백 타입이 없습니다.
              </div>
            )}
          </div>

          {/* Next Button */}
          <button onClick={handleNext} className="btn-next">
            <span className="next-text">Next</span>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Rating Slider Component
 * Figma: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=9-2022&m=dev
 */
interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
}

const RatingSlider = ({ value, onChange }: RatingSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [_isDragging, setIsDragging] = useState(false)

  const min = 0
  const max = 5
  const percentage = ((value - min) / (max - min)) * 100

  const calculateValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return value

    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width))
    const newValue = Math.round(percentage * (max - min)) + min
    return newValue
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    setIsDragging(true)
    const newValue = calculateValueFromPosition(e.clientX)
    onChange(newValue)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const movedValue = calculateValueFromPosition(moveEvent.clientX)
      onChange(movedValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const newValue = calculateValueFromPosition(e.touches[0].clientX)
    onChange(newValue)

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const movedValue = calculateValueFromPosition(moveEvent.touches[0].clientX)
      onChange(movedValue)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div 
      className="rating-slider-container"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${percentage}%` }}>
          <div className="slider-knob"></div>
        </div>
      </div>
      <div className="slider-steps">
        {[0, 1, 2, 3, 4, 5].map((step, _index) => (
          <div key={step} className="slider-step">
            <span className="step-number">{step}</span>
          </div>
        ))}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={handleInputChange}
        className="slider-input"
      />
    </div>
  )
}
