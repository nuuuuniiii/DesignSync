import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { StarRating } from '@/components/StarRating/StarRating'
import { FeedbackItem } from '@/components/FeedbackItem/FeedbackItem'
import './project-overview.css'

/**
 * Project Detail 화면
 *
 * Figma 디자인:
 * - https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-9937&m=dev
 */
export const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단: /web이면 app=false (app=off), 아니면 app=true (app=on)
  // Explore Web에서 카드 클릭 시 /projects/:projectId/web 경로로 이동하므로 isApp = false
  // Explore App에서 카드 클릭 시 /projects/:projectId 경로로 이동하므로 isApp = true
  const isApp = !location.pathname.includes('/web')
  
  const [selectedDesign, setSelectedDesign] = useState('Login')

  // Mock data
  const creator = 'J**** | 토스 2년차'
  const projectName = 'Toss Redesign Project'
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

  const designs = [
    { id: '1', name: 'Login' },
    { id: '2', name: 'Home' },
    { id: '3', name: 'Explore' },
    { id: '4', name: 'Image Generation' },
  ]

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

  const handleDesignSelect = (designName: string) => {
    setSelectedDesign(designName)
  }

  const handleScreenClick = (screenId: string) => {
    // Scroll to Feedbacks section
    const feedbacksSection = document.querySelector('.project-overview-feedbacks-section')
    if (feedbacksSection) {
      feedbacksSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMenuAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    console.log(action, feedbackId)
  }

  const handleAddFeedback = () => {
    navigate(`/projects/${projectId}/feedback/rating`)
  }

  const leftRatings = ratingTypes.slice(0, 3)
  const rightRatings = ratingTypes.slice(3, 6)

  return (
    <div className="project-overview-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      {/* Project Detail Header */}
      <div className="project-overview-header">
        <div className="project-overview-header-top">
          <div className="project-overview-info">
            <p className="project-overview-creator">{creator}</p>
            <h1 className="project-overview-title">{projectName}</h1>
          </div>
          <button onClick={handleAddFeedback} className="project-overview-add-feedback-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2V16M2 9H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Feedback</span>
          </button>
        </div>
        <div className="project-overview-header-bottom">
          <div className="project-overview-platform-category-field">
            <div className="project-overview-platform-tag">{isApp ? 'App' : 'Web'}</div>
            <p className="project-overview-category-text">{description}</p>
          </div>
        </div>
      </div>

      {/* Whole Section */}
      <div className="project-overview-whole-section">
        <div className="project-overview-whole-section-content">
          {/* Category and Rating Section */}
          <div className="project-overview-category-rating-wrapper">
            <div className="project-overview-category-section">
              <p className="project-overview-section-label">Category</p>
              <p className="project-overview-section-value">{category}</p>
            </div>

            <div className="project-overview-rating-section">
              <p className="project-overview-section-label">Rating</p>
              <div className="project-overview-ratings-container">
                <div className="project-overview-ratings-column">
                  {leftRatings.map((rating) => (
                    <div key={rating.id} className="project-overview-rating-item">
                      <div className="project-overview-rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
                <div className="project-overview-ratings-column">
                  {rightRatings.map((rating) => (
                    <div key={rating.id} className="project-overview-rating-item">
                      <div className="project-overview-rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Contents Section */}
          <div className="project-overview-contents-section">
            <div className="project-overview-section-divider"></div>

            <div className="project-overview-contents">
              {/* Designs Section */}
              <div className="project-overview-designs-section">
                <p className="project-overview-section-label">Designs</p>
                <div className="project-overview-designs-list">
                  {designs.map((design) => (
                    <button
                      key={design.id}
                      className={`project-overview-design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                      onClick={() => handleDesignSelect(design.name)}
                    >
                      {design.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screen/Feedback Section */}
              <div className="project-overview-screen-feedback-section">
                {/* Screen Images Section */}
                <div className={`project-overview-screens-container ${isApp ? 'project-overview-screens-app' : 'project-overview-screens-web'}`}>
                  {screens.map((screen) => (
                    <div
                      key={screen.id}
                      className={`project-overview-screen-card ${isApp ? 'project-overview-screen-card-app' : 'project-overview-screen-card-web'}`}
                      onClick={() => handleScreenClick(screen.id)}
                    >
                      <div className="project-overview-screen-image-wrapper">
                        <div className="project-overview-screen-placeholder"></div>
                      </div>
                      {!isApp && (
                        <div className="project-overview-screen-badge-wrapper">
                          <div className="project-overview-screen-number-badge">
                            <span>{screen.number}</span>
                          </div>
                        </div>
                      )}
                      {isApp && (
                        <div className="project-overview-screen-number-badge">
                          <span>{screen.number}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Feedbacks Section */}
                <div className="project-overview-feedbacks-section">
                  <p className="project-overview-section-label">Feedbacks</p>
                  <div className="project-overview-feedbacks-list">
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
