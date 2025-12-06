import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { StarRating } from '@/components/StarRating/StarRating'
import { FeedbackItem } from '@/components/FeedbackItem/FeedbackItem'
import './my-project-detail.css'

/**
 * My Project Detail 화면
 *
 * Figma 디자인:
 * - https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=99-10713&m=dev
 */
export const MyProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단: /web이면 app=false (app=off), 아니면 app=true (app=on)
  // My Project Web에서 카드 클릭 시 /my-projects/:projectId/web 경로로 이동하므로 isApp = false
  // My Project App에서 카드 클릭 시 /my-projects/:projectId 경로로 이동하므로 isApp = true
  const isApp = !location.pathname.includes('/web')
  
  const [selectedDesign, setSelectedDesign] = useState('Login')

  // Mock data
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
    <div className="my-project-detail-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      {/* Project Detail Header */}
      <div className="my-project-detail-header">
        <div className="my-project-header-top">
          <div className="my-project-info">
            <p className="my-project-creator">My project</p>
            <h1 className="my-project-title">{projectName}</h1>
          </div>
        </div>
        <div className="my-project-header-bottom">
          <div className="my-project-platform-category-field">
            <div className="my-project-platform-tag">{isApp ? 'App' : 'Web'}</div>
            <p className="my-project-category-text">{description}</p>
          </div>
        </div>
      </div>

      {/* Whole Section */}
      <div className="my-project-whole-section">
        <div className="my-project-whole-section-content">
          {/* Category and Rating Section */}
          <div className="my-project-category-rating-wrapper">
            <div className="my-project-category-section">
              <p className="my-project-section-label">Category</p>
              <p className="my-project-section-value">{category}</p>
            </div>

            <div className="my-project-rating-section">
              <p className="my-project-section-label">Rating</p>
              <div className="my-project-ratings-container">
                <div className="my-project-ratings-column">
                  {leftRatings.map((rating) => (
                    <div key={rating.id} className="my-project-rating-item">
                      <div className="my-project-rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
                <div className="my-project-ratings-column">
                  {rightRatings.map((rating) => (
                    <div key={rating.id} className="my-project-rating-item">
                      <div className="my-project-rating-theme">{rating.name}</div>
                      <StarRating rating={rating.rating} maxRating={5} size={17} readOnly />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Contents Section */}
          <div className="my-project-contents-section">
            <div className="my-project-section-divider"></div>

            <div className="my-project-contents">
              {/* Designs Section */}
              <div className="my-project-designs-section">
                <p className="my-project-section-label">Designs</p>
                <div className="my-project-designs-list">
                  {designs.map((design) => (
                    <button
                      key={design.id}
                      className={`my-project-design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                      onClick={() => handleDesignSelect(design.name)}
                    >
                      {design.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screen/Feedback Section */}
              <div className="my-project-screen-feedback-section">
                {/* Screen Images Section */}
                <div className={`my-project-screens-container ${isApp ? 'my-project-screens-app' : 'my-project-screens-web'}`}>
                  {screens.map((screen) => (
                    <div
                      key={screen.id}
                      className={`my-project-screen-card ${isApp ? 'my-project-screen-card-app' : 'my-project-screen-card-web'}`}
                      onClick={() => handleScreenClick(screen.id)}
                    >
                      <div className="my-project-screen-image-wrapper">
                        <div className="my-project-screen-placeholder"></div>
                      </div>
                      {!isApp && (
                        <div className="my-project-screen-badge-wrapper">
                          <div className="my-project-screen-number-badge">
                            <span>{screen.number}</span>
                          </div>
                        </div>
                      )}
                      {isApp && (
                        <div className="my-project-screen-number-badge">
                          <span>{screen.number}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Feedbacks Section */}
                <div className="my-project-feedbacks-section">
                  <p className="my-project-section-label">Feedbacks</p>
                  <div className="my-project-feedbacks-list">
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

