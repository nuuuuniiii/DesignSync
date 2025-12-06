import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { StarRating } from '@/components/StarRating/StarRating'
import { FeedbackItem } from '@/components/FeedbackItem/FeedbackItem'
import './project-overview.css'

/**
 * Project Detail 화면
 *
 * Figma 디자인:
 * - 메인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-9937&m=dev
 * - Screen 컴포넌트: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=69-7558&m=dev
 */
export const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단: /web이면 app=false, 아니면 app=true
  const isApp = !location.pathname.includes('/web')
  
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [designInputs, setDesignInputs] = useState<string[]>([''])
  
  // 페이지 진입 시 디폴트로 Input field 하나만 표시
  useEffect(() => {
    setDesignInputs([''])
  }, [])

  // Mock data
  const projectName = 'Toss Redesign Project'
  const creator = 'J**** | 토스 2년차'
  const platform = isApp ? 'App' : 'Web'
  const description = 'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.'
  const category = 'E-Commerce'

  const ratingTypes = [
    { id: '1', name: 'User Flow', rating: 4 },
    { id: '2', name: 'Interaction Design', rating: 3.5 },
    { id: '3', name: 'Visual Design', rating: 3.5 },
    { id: '4', name: 'UX Writing', rating: 3 },
    { id: '5', name: 'Information Architecture', rating: 3.5 },
    { id: '6', name: 'Usability', rating: 3.5 },
  ]

  // 디자인 목록은 항상 빈 배열 (Input field만 표시)
  const designs: { id: string; name: string }[] = []

  const screens = [
    { id: '1', number: 1 },
    { id: '2', number: 2 },
    { id: '3', number: 3 },
    { id: '4', number: 4 },
    { id: '5', number: 5 },
  ]

  const questions = [
    {
      id: '1',
      number: '1',
      text: '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?',
      feedbacks: [
        {
          id: 'f1',
          screenNumber: 1,
          author: 'J**** | 토스 2년차',
          content: 'CTA버튼이 현재 \'완료하기\'와 \'이전으로\' 두개가 있는데 두개의 색이 똑같아서 위계가 명확하지 않습니다. 그래서 행동 유도성이 약해진거같아요. 그래서 다음에 무엇을 해야하는지 헷갈립니다.',
          isMyComment: false,
        },
        {
          id: 'f2',
          screenNumber: 1,
          author: 'J**** | 토스 2년차',
          content: 'CTA버튼이 현재 \'완료하기\'와 \'이전으로\' 두개가 있는데 두개의 색이 똑같아서 위계가 명확하지 않습니다. 그래서 행동 유도성이 약해진거같아요. 그래서 다음에 무엇을 해야하는지 헷갈립니다.',
          isMyComment: false,
        },
      ],
    },
  ]

  const handleNewFeedback = () => {
    navigate(`/projects/${projectId}/feedback/screen`)
  }

  const handleDesignSelect = (designName: string) => {
    setSelectedDesign(designName)
  }

  const handleAddDesign = () => {
    setDesignInputs([...designInputs, ''])
  }

  const handleDesignInputChange = (index: number, value: string) => {
    const newInputs = [...designInputs]
    newInputs[index] = value
    setDesignInputs(newInputs)
  }

  const handleScreenClick = (screenId: string) => {
    // Scroll to Feedbacks section
    const feedbacksSection = document.querySelector('.feedbacks-section')
    if (feedbacksSection) {
      feedbacksSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMenuAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    console.log(action, feedbackId)
  }

  const leftRatings = ratingTypes.slice(0, 3)
  const rightRatings = ratingTypes.slice(3, 6)

  return (
    <div className="project-detail-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      {/* Project Detail Header */}
      <div className="project-detail-header">
        <div className="project-header-top">
          <div className="project-info">
            <p className="project-creator">{creator}</p>
            <h1 className="project-title">{projectName}</h1>
          </div>
          <button onClick={handleNewFeedback} className="btn-add-feedback">
            <span className="plus-icon">+</span>
            Add Feedback
          </button>
        </div>
        <div className="project-header-bottom">
          <div className="platform-tag">{platform}</div>
          <div className="category-field">
            <p className="category-text">
              Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/
            </p>
          </div>
        </div>
      </div>

      {/* Whole Section */}
      <div className="whole-section">
        <div className="whole-section-content">
          {/* Left: Category and Rating */}
          <div className="category-rating-wrapper">
            <div className="category-section">
              <p className="section-label">Category</p>
              <p className="section-value">{category}</p>
            </div>

            <div className="rating-section">
              <p className="section-label">Rating</p>
              <div className="ratings-container">
                <div className="ratings-column">
                  {leftRatings.map((rating) => (
                    <div key={rating.id} className="rating-item">
                      <div className="rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
                <div className="ratings-column">
                  {rightRatings.map((rating) => (
                    <div key={rating.id} className="rating-item">
                      <div className="rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Section with Divider, Designs and Screen/Feedback */}
          <div className="project-contents-section">
            <div className="section-divider"></div>

            <div className="project-contents">
              {/* Designs Section */}
              <div className="designs-section">
                <div className="designs-header">
                  <p className="designs-title">Your Designs</p>
                </div>
                <div className="designs-content">
                  <div className="designs-input-wrapper">
                    <input
                      type="text"
                      className="design-input"
                      placeholder="What is your Screen name?"
                      value={designInputs[0] || ''}
                      onChange={(e) => handleDesignInputChange(0, e.target.value)}
                    />
                  </div>
                  <button className="btn-add-design" onClick={handleAddDesign}>
                    <svg width="21" height="21" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="8.5" stroke="white" strokeWidth="1" />
                      <path d="M9 5V13M5 9H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    화면 추가
                  </button>
                </div>
              </div>

              {/* Screen/Feedback Section */}
              <div className="screen-feedback-section">
                {/* Screen Images Section */}
                <div className={`screens-container ${isApp ? 'screens-app' : 'screens-web'}`}>
                  {screens.map((screen) => (
                    <div
                      key={screen.id}
                      className={`screen-card ${isApp ? 'screen-card-app' : 'screen-card-web'}`}
                      onClick={() => handleScreenClick(screen.id)}
                    >
                      <div className="screen-image-wrapper">
                        <div className="screen-placeholder"></div>
                      </div>
                      <div className="screen-number-badge">
                        <span>{screen.number}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedbacks Section */}
                <div className="feedbacks-section">
                  <p className="section-label">Feedbacks</p>
                  <div className="feedbacks-list">
                    {questions.map((question) => (
                      <FeedbackItem
                        key={question.id}
                        questionNumber={question.number}
                        question={question.text}
                        feedbacks={question.feedbacks}
                        onMenuClick={handleMenuAction}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
