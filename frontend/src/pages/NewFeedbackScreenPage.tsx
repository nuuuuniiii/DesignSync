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
            <svg width="178" height="48" viewBox="0 0 178 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="178" height="48" rx="8.4" fill="#C3C3C3"/>
              <path d="M37.1393 30.1709C37.2474 30.063 37.3332 29.9348 37.3918 29.7937C37.4503 29.6525 37.4805 29.5012 37.4805 29.3484C37.4805 29.1957 37.4503 29.0444 37.3918 28.9032C37.3332 28.7621 37.2474 28.6339 37.1393 28.5259L32.6126 23.9993L37.1393 19.4726C37.3574 19.2545 37.48 18.9586 37.48 18.6501C37.48 18.3416 37.3574 18.0458 37.1393 17.8276C36.9211 17.6095 36.6253 17.4869 36.3168 17.4869C36.0083 17.4869 35.7124 17.6095 35.4943 17.8276L30.1393 23.1826C30.0311 23.2905 29.9453 23.4188 29.8868 23.5599C29.8282 23.701 29.7981 23.8523 29.7981 24.0051C29.7981 24.1579 29.8282 24.3092 29.8868 24.4503C29.9453 24.5915 30.0311 24.7197 30.1393 24.8276L35.4943 30.1826C35.9376 30.6259 36.6843 30.6259 37.1393 30.1709Z" fill="white"/>
              <path d="M58.6816 31V16.8594H63.9941C67.2363 16.8594 68.9746 18.832 68.9746 21.5469C68.9746 24.2617 67.2168 26.2148 63.9551 26.2148H61.2207V31H58.6816ZM61.2207 24.125H63.6035C65.5176 24.125 66.377 23.0508 66.377 21.5469C66.377 20.0234 65.5176 18.9883 63.6035 18.9883H61.2207V24.125ZM70.9082 31V20.3945H73.3301V22.1523H73.4473C73.8184 20.9414 74.8535 20.2383 76.0645 20.2383C76.3379 20.2383 76.7285 20.2578 76.9629 20.2969V22.6016C76.748 22.5234 76.2207 22.4453 75.8105 22.4453C74.4238 22.4453 73.4082 23.4023 73.4082 24.75V31H70.9082ZM82.8027 31.2148C79.5996 31.2148 77.6465 29.0859 77.6465 25.7656C77.6465 22.4844 79.6387 20.2578 82.666 20.2578C85.2637 20.2578 87.5098 21.8789 87.5098 25.6094V26.3906H80.1074C80.1367 28.1973 81.2012 29.2617 82.8223 29.2617C83.916 29.2617 84.6582 28.793 84.9707 28.168H87.4121C86.9629 30.0039 85.2637 31.2148 82.8027 31.2148ZM80.127 24.6914H85.127C85.1074 23.2461 84.1504 22.1914 82.7051 22.1914C81.2012 22.1914 80.2051 23.334 80.127 24.6914ZM98.6035 20.3945L94.8145 31H92.0801L88.291 20.3945H90.9473L93.3887 28.2852H93.5059L95.9668 20.3945H98.6035ZM100.166 31V20.3945H102.666V31H100.166ZM101.436 18.8906C100.654 18.8906 99.9902 18.2852 99.9902 17.5234C99.9902 16.7812 100.654 16.1758 101.436 16.1758C102.236 16.1758 102.881 16.7812 102.881 17.5234C102.881 18.2852 102.236 18.8906 101.436 18.8906ZM109.678 31.2148C106.592 31.2148 104.6 29.0273 104.6 25.7461C104.6 22.4453 106.592 20.2578 109.678 20.2578C112.783 20.2578 114.756 22.4453 114.756 25.7461C114.756 29.0273 112.783 31.2148 109.678 31.2148ZM109.697 29.2227C111.396 29.2227 112.236 27.6797 112.236 25.7266C112.236 23.793 111.396 22.2305 109.697 22.2305C107.959 22.2305 107.119 23.793 107.119 25.7266C107.119 27.6797 107.959 29.2227 109.697 29.2227ZM123.467 26.5469V20.3945H125.947V31H123.545V29.125H123.428C122.939 30.2969 121.826 31.1367 120.244 31.1367C118.154 31.1367 116.709 29.6914 116.689 27.1523V20.3945H119.189V26.7617C119.189 28.1094 119.99 28.9688 121.201 28.9688C122.295 28.9688 123.467 28.168 123.467 26.5469ZM134.346 23.4219C134.189 22.6211 133.525 22.1133 132.471 22.1133C131.396 22.1133 130.615 22.6406 130.635 23.3633C130.615 23.9102 131.064 24.3203 132.139 24.5742L133.936 24.9453C135.947 25.3945 136.904 26.3125 136.924 27.8359C136.904 29.8281 135.166 31.2148 132.393 31.2148C129.697 31.2148 128.096 30.0039 127.842 27.9727H130.381C130.537 28.8711 131.24 29.3203 132.393 29.3203C133.584 29.3203 134.385 28.832 134.385 28.0508C134.385 27.4453 133.896 27.0547 132.842 26.8203L131.143 26.4492C129.17 26.0586 128.154 25.0234 128.154 23.5C128.154 21.5469 129.834 20.2578 132.432 20.2578C134.971 20.2578 136.533 21.4883 136.709 23.4219H134.346Z" fill="white"/>
            </svg>
          </button>
          <button onClick={handleRegister} className="btn-register">
            <svg width="174" height="48" viewBox="0 0 174 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="174" height="48" rx="8.4" fill="black"/>
              <path d="M41.3125 31V16.8594H46.625C49.8672 16.8594 51.6055 18.6758 51.6055 21.3711C51.6055 23.2949 50.7266 24.7207 49.0664 25.3945L52.1133 31H49.2812L46.5078 25.8242H43.8516V31H41.3125ZM43.8516 23.6953H46.2344C48.1484 23.6953 49.0078 22.875 49.0078 21.3711C49.0078 19.8672 48.1484 18.9883 46.2344 18.9883H43.8516V23.6953ZM58.2266 31.2148C55.0234 31.2148 53.0703 29.0859 53.0703 25.7656C53.0703 22.4844 55.0625 20.2578 58.0898 20.2578C60.6875 20.2578 62.9336 21.8789 62.9336 25.6094V26.3906H55.5312C55.5605 28.1973 56.625 29.2617 58.2461 29.2617C59.3398 29.2617 60.082 28.793 60.3945 28.168H62.8359C62.3867 30.0039 60.6875 31.2148 58.2266 31.2148ZM55.5508 24.6914H60.5508C60.5312 23.2461 59.5742 22.1914 58.1289 22.1914C56.625 22.1914 55.6289 23.334 55.5508 24.6914ZM69.4961 35.1992C66.6836 35.1992 64.9062 33.9492 64.7305 31.957H67.2109C67.3867 32.875 68.2656 33.3242 69.5352 33.3242C71.0195 33.3242 71.9961 32.6797 71.9961 31.1172V29.0859H71.8789C71.4883 29.8672 70.6484 30.8438 68.8125 30.8438C66.3711 30.8438 64.4375 29.0664 64.4375 25.6094C64.4375 22.1133 66.3711 20.2578 68.832 20.2578C70.707 20.2578 71.4883 21.3711 71.8789 22.1328H71.9961V20.3945H74.457V31.1758C74.457 33.8906 72.3672 35.1992 69.4961 35.1992ZM69.4961 28.8906C71.0977 28.8906 72.0156 27.6797 72.0156 25.6484C72.0156 23.6367 71.1172 22.2891 69.4961 22.2891C67.8359 22.2891 66.9766 23.7148 66.9766 25.6484C66.9766 27.6016 67.8555 28.8906 69.4961 28.8906ZM76.8398 31V20.3945H79.3398V31H76.8398ZM78.1094 18.8906C77.3281 18.8906 76.6641 18.2852 76.6641 17.5234C76.6641 16.7812 77.3281 16.1758 78.1094 16.1758C78.9102 16.1758 79.5547 16.7812 79.5547 17.5234C79.5547 18.2852 78.9102 18.8906 78.1094 18.8906ZM87.7383 23.4219C87.582 22.6211 86.918 22.1133 85.8633 22.1133C84.7891 22.1133 84.0078 22.6406 84.0273 23.3633C84.0078 23.9102 84.457 24.3203 85.5312 24.5742L87.3281 24.9453C89.3398 25.3945 90.2969 26.3125 90.3164 27.8359C90.2969 29.8281 88.5586 31.2148 85.7852 31.2148C83.0898 31.2148 81.4883 30.0039 81.2344 27.9727H83.7734C83.9297 28.8711 84.6328 29.3203 85.7852 29.3203C86.9766 29.3203 87.7773 28.832 87.7773 28.0508C87.7773 27.4453 87.2891 27.0547 86.2344 26.8203L84.5352 26.4492C82.5625 26.0586 81.5469 25.0234 81.5469 23.5C81.5469 21.5469 83.2266 20.2578 85.8242 20.2578C88.3633 20.2578 89.9258 21.4883 90.1016 23.4219H87.7383ZM97.5039 20.3945V22.3086H95.4141V27.8164C95.4141 28.832 95.9219 29.0469 96.5469 29.0469C96.8398 29.0469 97.3281 29.0273 97.6406 29.0078V31.0391C97.3477 31.0977 96.8594 31.1367 96.2344 31.1367C94.3594 31.1367 92.9141 30.2188 92.9336 28.2266V22.3086H91.4102V20.3945H92.9336V17.8555H95.4141V20.3945H97.5039ZM104.008 31.2148C100.805 31.2148 98.8516 29.0859 98.8516 25.7656C98.8516 22.4844 100.844 20.2578 103.871 20.2578C106.469 20.2578 108.715 21.8789 108.715 25.6094V26.3906H101.312C101.342 28.1973 102.406 29.2617 104.027 29.2617C105.121 29.2617 105.863 28.793 106.176 28.168H108.617C108.168 30.0039 106.469 31.2148 104.008 31.2148ZM101.332 24.6914H106.332C106.312 23.2461 105.355 22.1914 103.91 22.1914C102.406 22.1914 101.41 23.334 101.332 24.6914ZM110.648 31V20.3945H113.07V22.1523H113.188C113.559 20.9414 114.594 20.2383 115.805 20.2383C116.078 20.2383 116.469 20.2578 116.703 20.2969V22.6016C116.488 22.5234 115.961 22.4453 115.551 22.4453C114.164 22.4453 113.148 23.4023 113.148 24.75V31H110.648Z" fill="white"/>
              <path d="M136.861 17.8291C136.753 17.937 136.667 18.0652 136.608 18.2063C136.55 18.3475 136.52 18.4988 136.52 18.6516C136.52 18.8043 136.55 18.9556 136.608 19.0968C136.667 19.2379 136.753 19.3661 136.861 19.4741L141.387 24.0007L136.861 28.5274C136.643 28.7455 136.52 29.0414 136.52 29.3499C136.52 29.6584 136.643 29.9542 136.861 30.1724C137.079 30.3905 137.375 30.5131 137.683 30.5131C137.992 30.5131 138.288 30.3905 138.506 30.1724L143.861 24.8174C143.969 24.7095 144.055 24.5812 144.113 24.4401C144.172 24.299 144.202 24.1477 144.202 23.9949C144.202 23.8421 144.172 23.6908 144.113 23.5497C144.055 23.4085 143.969 23.2803 143.861 23.1724L138.506 17.8174C138.062 17.3741 137.316 17.3741 136.861 17.8291Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

