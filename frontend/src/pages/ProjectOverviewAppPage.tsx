import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Button, StarRating, ScreenCard, FeedbackItem } from '../components'
import './project-overview-app.css'

export const ProjectOverviewAppPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  // Mock data
  const projectName = 'Toss Redesign Project'
  const creator = 'J**** | 토스 2년차'
  const platform = 'App'
  const description = 'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.'
  const category = 'E-Commerce'

  const [selectedDesign, setSelectedDesign] = useState('Login')

  const ratingTypes = [
    { id: '1', name: 'User Flow', rating: 4 },
    { id: '2', name: 'Interaction Design', rating: 3 },
    { id: '3', name: 'Visual Design', rating: 3 },
    { id: '4', name: 'UX Writing', rating: 3 },
    { id: '5', name: 'Information Architecture', rating: 5 },
    { id: '6', name: 'Usability', rating: 3 },
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
          content: 'CTA버튼이 현재 \'완료하기\'와 \'이전으로\' 두개가 있는데 두개의 색이 똑같아서 위계가 명확하지 않습니다. \n그래서 행동 유도성이 약해진거같아요. 그래서 다음에 무엇을 해야하는지 헷갈립니다.',
          isMyComment: false,
        },
        {
          id: 'f2',
          screenNumber: 1,
          author: 'J**** | 토스 2년차',
          content: 'CTA버튼이 현재 \'완료하기\'와 \'이전으로\' 두개가 있는데 두개의 색이 똑같아서 위계가 명확하지 않습니다. \n그래서 행동 유도성이 약해진거같아요. 그래서 다음에 무엇을 해야하는지 헷갈립니다.',
          isMyComment: false,
        },
        {
          id: 'f3',
          screenNumber: 1,
          author: 'J**** | 토스 2년차',
          content: 'CTA버튼이 현재 \'완료하기\'와 \'이전으로\' 두개가 있는데 두개의 색이 똑같아서 위계가 명확하지 않습니다. \n그래서 행동 유도성이 약해진거같아요. 그래서 다음에 무엇을 해야하는지 헷갈립니다.',
          isMyComment: true,
        },
      ],
    },
  ]

  const handleNewFeedback = () => {
    navigate(`/projects/${projectId}/feedback/screen`)
  }

  const handleDesignSelect = (designId: string) => {
    const design = designs.find((d) => d.id === designId)
    if (design) {
      setSelectedDesign(design.name)
    }
  }

  const handleScreenClick = (screenId: string) => {
    // Scroll to Feedbacks section
    const feedbacksSection = document.querySelector('.feedbacks-section')
    if (feedbacksSection) {
      feedbacksSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMenuAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    // Handle menu action
    console.log(action, feedbackId)
  }

  const leftRatings = ratingTypes.slice(0, 3)
  const rightRatings = ratingTypes.slice(3, 6)

  return (
    <Layout>
      <div className="project-overview-page">
        {/* Project Section */}
        <div className="project-section">
          <div className="project-header-info">
            <div className="project-info">
              <p className="project-creator">{creator}</p>
              <h1 className="project-title">{projectName}</h1>
            </div>
            <Button onClick={handleNewFeedback} variant="primary" className="add-feedback-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="8.5" stroke="white" strokeWidth="1" />
                <path d="M9 5V13M5 9H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add Feedback
            </Button>
          </div>
          <div className="project-meta">
            <div className="platform-tag">{platform}</div>
            <p className="project-description">{description}</p>
          </div>
          <div className="category-field">
            <p className="category-text">
              Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/Select/
            </p>
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
                  <p className="section-label">Designs</p>
                  <div className="designs-list">
                    {designs.map((design) => (
                      <button
                        key={design.id}
                        className={`design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                        onClick={() => handleDesignSelect(design.id)}
                      >
                        {design.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screen/Feedback Section */}
                <div className="screen-feedback-section">
                  {/* Screen Images Section */}
                  <div className="screens-row">
                    {screens.map((screen) => (
                      <ScreenCard
                        key={screen.id}
                        screenNumber={screen.number}
                        imageUrl={undefined}
                        onClick={() => handleScreenClick(screen.id)}
                      />
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
    </Layout>
  )
}

