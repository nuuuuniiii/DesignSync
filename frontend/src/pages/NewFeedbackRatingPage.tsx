import { useState, useRef } from 'react'
import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import './new-feedback-rating.css'

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
  
  const [ratings, setRatings] = useState<Record<string, number>>({
    'user-flow': 0,
    'ux-writing': 0,
    'interaction-design': 0,
    'information-architecture': 0,
    'visual-design': 0,
    'usability': 0,
  })

  // Mock 데이터
  const projectName = 'Toss Redesign Project'
  const description = 'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.'

  const ratingTypes = [
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

  const leftRatings = ratingTypes.slice(0, 3)
  const rightRatings = ratingTypes.slice(3, 6)

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
    console.log('Navigating to screen page with projectId:', projectId)
    navigate(`/projects/${projectId}/feedback/screen`, { state: { ratings } })
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
            <p className="project-name">{projectName}</p>
          </div>
          <div className="project-platform-field">
            <div className="platform-tag">{isApp ? 'App' : 'Web'}</div>
            <p className="project-description">{description}</p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="rating-section-wrapper">
          <div className="rating-section">
            <p className="rating-section-label">Ratings</p>
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
                          value={ratings[rating.id]}
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
                          value={ratings[rating.id]}
                          onChange={(value) => handleRatingChange(rating.id, value)}
                        />
                      </div>
                    </div>
                    {index < rightRatings.length - 1 && <div className="section-divider-line"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
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
  const [isDragging, setIsDragging] = useState(false)

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
        {[0, 1, 2, 3, 4, 5].map((step, index) => (
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
