import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import './new-feedback-screen.css'

/**
 * New Feedback Screen 화면
 *
 * Figma 디자인:
 * - https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=89-8202&m=dev
 * - Text field: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=90-8340&m=dev
 */
export const NewFeedbackScreenPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단
  const isApp = !location.pathname.includes('/web')
  
  const [selectedDesign, setSelectedDesign] = useState('Login')
  const [selectedScreen, setSelectedScreen] = useState<number | null>(1)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  // 각 디자인별, 질문별로 여러 피드백을 관리 (각 피드백은 id, text, screenNumber를 가짐)
  // 구조: { designName: { questionId: [{ id, text, screenNumber }] } }
  const [feedbacks, setFeedbacks] = useState<Record<string, Record<string, Array<{ id: string; text: string; screenNumber: number | null }>>>>({
    'Login': {
      'q1': [{ id: 'q1-input-0', text: '', screenNumber: null }],
      'q2': [{ id: 'q2-input-0', text: '', screenNumber: null }],
    },
    'Home': {
      'q1': [{ id: 'q1-input-0', text: '', screenNumber: null }],
      'q2': [{ id: 'q2-input-0', text: '', screenNumber: null }],
    },
    'Explore': {
      'q1': [{ id: 'q1-input-0', text: '', screenNumber: null }],
      'q2': [{ id: 'q2-input-0', text: '', screenNumber: null }],
    },
    'Image Generation': {
      'q1': [{ id: 'q1-input-0', text: '', screenNumber: null }],
      'q2': [{ id: 'q2-input-0', text: '', screenNumber: null }],
    },
  })
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({})

  // Mock 데이터
  const projectName = 'Toss Redesign Project'
  const description = 'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.'

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
    { id: '6', number: 6 },
    { id: '7', number: 7 },
  ]

  const questions = [
    {
      id: 'q1',
      number: 'Q1',
      text: '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?',
    },
    {
      id: 'q2',
      number: 'Q2',
      text: '서비스에서 사용하는 용어나 개념이 자연스럽고 익숙하게 느껴졌나요?',
    },
  ]

  const handleDesignSelect = (designName: string) => {
    setSelectedDesign(designName)
    // 디자인 변경 시 포커스 해제
    setFocusedInput(null)
    // 선택된 디자인에 대한 피드백이 없으면 초기화
    if (!feedbacks[designName]) {
      setFeedbacks((prev) => ({
        ...prev,
        [designName]: {
          'q1': [{ id: 'q1-input-0', text: '', screenNumber: null }],
          'q2': [{ id: 'q2-input-0', text: '', screenNumber: null }],
        },
      }))
    }
  }

  const handleScreenSelect = (screenNumber: number) => {
    setSelectedScreen(screenNumber)
    // 포커스된 입력 필드가 있으면 해당 필드에만 화면 번호 입력
    if (focusedInput) {
      const parts = focusedInput.split('-')
      const questionId = parts[0]
      const feedbackId = parts.slice(1).join('-')
      setFeedbacks((prev) => ({
        ...prev,
        [selectedDesign]: {
          ...prev[selectedDesign],
          [questionId]: prev[selectedDesign][questionId].map((fb) =>
            fb.id === feedbackId ? { ...fb, screenNumber } : fb
          ),
        },
      }))
    }
  }

  const handleInputFocus = (questionId: string, feedbackId: string) => {
    setFocusedInput(`${questionId}-${feedbackId}`)
  }

  const handleInputBlur = () => {
    setFocusedInput(null)
  }

  const handleFeedbackChange = (questionId: string, feedbackId: string, value: string) => {
    setFeedbacks((prev) => ({
      ...prev,
      [selectedDesign]: {
        ...prev[selectedDesign],
        [questionId]: prev[selectedDesign][questionId].map((fb) =>
          fb.id === feedbackId ? { ...fb, text: value } : fb
        ),
      },
    }))
    // 텍스트가 입력되고, 선택된 화면 번호가 있고, 아직 화면 번호가 설정되지 않았다면 자동으로 설정
    if (value.trim() !== '' && selectedScreen !== null) {
      setFeedbacks((prev) => ({
        ...prev,
        [selectedDesign]: {
          ...prev[selectedDesign],
          [questionId]: prev[selectedDesign][questionId].map((fb) =>
            fb.id === feedbackId && fb.screenNumber === null
              ? { ...fb, screenNumber: selectedScreen }
              : fb
          ),
        },
      }))
    }
  }

  const handleFeedbackKeyDown = (questionId: string, feedbackId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const currentFeedback = feedbacks[selectedDesign][questionId].find((fb) => fb.id === feedbackId)
      if (currentFeedback && currentFeedback.text.trim() !== '') {
        // 마지막 필드가 비어있지 않은 경우에만 새 필드 추가
        const lastFeedback = feedbacks[selectedDesign][questionId][feedbacks[selectedDesign][questionId].length - 1]
        if (lastFeedback && lastFeedback.text.trim() !== '') {
          // 새로운 피드백 필드 추가 (숫자만 입력되어 있는 상태: screenNumber는 현재 선택된 화면 번호, text는 빈 문자열)
          const newFeedbackId = `${questionId}-input-${Date.now()}`
          setFeedbacks((prev) => ({
            ...prev,
            [selectedDesign]: {
              ...prev[selectedDesign],
              [questionId]: [
                ...prev[selectedDesign][questionId],
                { id: newFeedbackId, text: '', screenNumber: selectedScreen },
              ],
            },
          }))
          // 새 필드에 포커스
          setTimeout(() => {
            const newInput = document.querySelector(`input[data-feedback-id="${newFeedbackId}"]`) as HTMLInputElement
            if (newInput) {
              newInput.focus()
            }
          }, 0)
        }
      }
    }
  }

  const handleNumberBadgeClick = (questionId: string, feedbackId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const dropdownKey = `${questionId}-${feedbackId}`
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey],
    }))
  }

  const handleNumberSelect = (questionId: string, feedbackId: string, number: number) => {
    setFeedbacks((prev) => ({
      ...prev,
      [selectedDesign]: {
        ...prev[selectedDesign],
        [questionId]: prev[selectedDesign][questionId].map((fb) =>
          fb.id === feedbackId ? { ...fb, screenNumber: number } : fb
        ),
      },
    }))
    setDropdownOpen((prev) => ({
      ...prev,
      [`${questionId}-${feedbackId}`]: false,
    }))
  }

  const handleDeleteFeedback = (questionId: string, feedbackId: string) => {
    setFeedbacks((prev) => {
      const updatedFeedbacks = prev[selectedDesign][questionId].filter((fb) => fb.id !== feedbackId)
      // 마지막 피드백을 삭제하면 빈 필드 하나는 남겨둠
      if (updatedFeedbacks.length === 0) {
        return {
          ...prev,
          [selectedDesign]: {
            ...prev[selectedDesign],
            [questionId]: [{ id: `${questionId}-input-0`, text: '', screenNumber: null }],
          },
        }
      }
      return {
        ...prev,
        [selectedDesign]: {
          ...prev[selectedDesign],
          [questionId]: updatedFeedbacks,
        },
      }
    })
  }

  const handlePrevious = () => {
    navigate(`/projects/${projectId}/feedback/rating`)
  }

  const handleRegister = () => {
    // TODO: 피드백 등록 로직
    console.log('Register feedback:', {
      projectId,
      selectedDesign,
      selectedScreen,
      feedbacks,
    })
    navigate(`/projects/${projectId}`)
  }

  return (
    <div className="new-feedback-screen-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      <div className="new-feedback-screen-content">
        <div className="new-feedback-screen-header">
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

        {/* Designs and Screen Section */}
        <div className="designs-screen-section">
          <div className="section-divider"></div>
          
          <div className="designs-screen-content">
            {/* Designs Sidebar */}
            <div className="designs-section">
              <p className="section-label">Designs</p>
              <div className="designs-list">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    className={`design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                    onClick={() => handleDesignSelect(design.name)}
                  >
                    {design.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Section */}
            <div className="screen-section">
              <div className="screens-container">
                {screens.map((screen) => (
                  <div
                    key={screen.id}
                    className={`screen-card ${selectedScreen === screen.number ? 'selected' : ''}`}
                    onClick={() => handleScreenSelect(screen.number)}
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
            </div>
          </div>
        </div>

        {/* Feedbacks Section */}
        <div className="feedbacks-section">
          {questions.map((question) => {
            const questionFeedbacks = feedbacks[selectedDesign]?.[question.id] || []

            return (
              <div key={question.id} className="feedback-section">
                <div className="question-header">
                  <div className="question-number">{question.number}</div>
                  <p className="question-text">{question.text}</p>
                </div>

                {/* Feedback Input Fields */}
                {questionFeedbacks.map((feedback) => {
                  const isInputFocused = focusedInput === `${question.id}-${feedback.id}`
                  const dropdownKey = `${question.id}-${feedback.id}`
                  const isDropdownOpen = dropdownOpen[dropdownKey] || false

                  return (
                    <div
                      key={feedback.id}
                      className={`feedback-input-wrapper ${isInputFocused ? 'focused' : ''}`}
                    >
                      <div className="feedback-content-wrapper">
                        {feedback.screenNumber !== null && (
                          <div
                            className="feedback-number-badge"
                            onClick={(e) => handleNumberBadgeClick(question.id, feedback.id, e)}
                          >
                            <span>{feedback.screenNumber}</span>
                          </div>
                        )}
                        <input
                          data-feedback-id={feedback.id}
                          type="text"
                          className="feedback-input"
                          placeholder="Register your own feedback"
                          value={feedback.text}
                          onChange={(e) => handleFeedbackChange(question.id, feedback.id, e.target.value)}
                          onKeyDown={(e) => handleFeedbackKeyDown(question.id, feedback.id, e)}
                          onFocus={() => handleInputFocus(question.id, feedback.id)}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteFeedback(question.id, feedback.id)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M15 5L5 15M5 5L15 15"
                            stroke="#A5A5A5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {isDropdownOpen && feedback.screenNumber !== null && (
                        <div className="dropdown-menu">
                          <div className="dropdown-number-list">
                            {Array.from({ length: screens.length }, (_, i) => i + 1).map((num, index) => (
                              <div key={num} className="dropdown-number-item">
                                <div
                                  className="dropdown-number-circle"
                                  onClick={() => handleNumberSelect(question.id, feedback.id, num)}
                                >
                                  {num}
                                </div>
                                {index < screens.length - 1 && <div className="dropdown-number-divider"></div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button onClick={handlePrevious} className="btn-previous">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(180 12 12)"
              />
            </svg>
            <span className="previous-text">Previous</span>
          </button>
          <button onClick={handleRegister} className="btn-register">
            <span className="register-text">Register</span>
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

