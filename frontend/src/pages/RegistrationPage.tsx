import { useState, useRef, useEffect } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { Input } from '@/components/Input/Input'
import { Textarea } from '@/components/Textarea/Textarea'
import { Select } from '@/components/Select/Select'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Button } from '@/components/Button/Button'
import './registration-page.css'

/**
 * Registration 페이지
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-6817&m=dev
 */
export const RegistrationPage = () => {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [platform, setPlatform] = useState<'web' | 'app'>('web')
  const [category, setCategory] = useState('')
  const [selectedFeedbackTypes, setSelectedFeedbackTypes] = useState<string[]>([])
  const [selectedDesign, setSelectedDesign] = useState<string>('Login')
  const [designs, setDesigns] = useState<string[]>(['Login', 'Home', 'Explore', 'Image Generation'])
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null)
  const [editingDesignValue, setEditingDesignValue] = useState<string>('')
  const [designName, setDesignName] = useState('Login')
  const inputRef = useRef<HTMLInputElement>(null)
  const [customQuestions, setCustomQuestions] = useState<string[]>([''])
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [isResolved, setIsResolved] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const feedbackTypes = [
    'User Flow',
    'Interaction Design',
    'Visual Design',
    'UX Writing',
    'Information Architecture',
    'Usability',
  ]

  const questionCategories = [
    { value: 'basic', label: 'Basic Questions' },
    { value: 'usability', label: 'Usability' },
    { value: 'design', label: 'Design' },
  ]

  const questions = [
    'What: 무엇이 문제인가요?',
    'Why: 왜 문제가 되나요?',
    'How: 어떻게 개선하면 좋을까요? (명확한 방향성)',
    '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?',
    '작업을 수행할 때 단계가 명확했다고 느꼈나요?',
    '화면 간 디자인 요소(버튼, 색상, 인터랙션)가 일관되게 유지되었나요?',
    '시선이 불필요하게 분산되거나 먼저 보면 좋을 요소가 묻히는 부분이 있었나요?',
    '이 서비스의 목적과 기능을 처음 사용했을 때 직관적으로 이해되었나요? 이해되지 않았다면 어떤 부분이 혼란스러웠나요?',
    '취소/뒤로가기 기능이 잘 보이고 예측 가능했나요?',
    '정보의 흐름과 순서가 실제 사용자 작업 방식과 맞았나요?',
    '서비스에서 사용하는 용어나 개념이 자연스럽고 익숙하게 느껴졌나요?',
    '사용 중 현재 상태나 진행 상황이 명확하게 보였나요?',
    '액션 후 시스템에서 제공하는 피드백(알림·메시지·애니메이션)이 명확했나요?',
    '입력 필드에서 실수를 유발하는 요소가 있었나요?',
    '필요한 옵션이나 정보가 화면에 충분히 드러나 있었나요?',
    '숙련자와 초보자 모두 편리하게 사용할 수 있다고 느꼈나요?',
    '오류 메시지가 문제 원인을 명확히 설명했나요?',
  ]

  const handleFeedbackTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedFeedbackTypes([...selectedFeedbackTypes, type])
    } else {
      setSelectedFeedbackTypes(selectedFeedbackTypes.filter((t) => t !== type))
    }
  }

  const handleQuestionToggle = (question: string) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question))
    } else {
      setSelectedQuestions([...selectedQuestions, question])
    }
  }

  const handleAddDesign = () => {
    const newDesign = `Design ${designs.length + 1}`
    setDesigns([...designs, newDesign])
    setSelectedDesign(newDesign)
    setDesignName(newDesign)
  }

  const handleDesignClick = (design: string, index: number) => {
    if (editingDesignId === `design-${index}`) {
      return // 이미 편집 중이면 클릭 무시
    }
    setSelectedDesign(design)
    setDesignName(design)
  }

  const handleDesignDoubleClick = (design: string, index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingDesignValue(design)
    setEditingDesignId(`design-${index}`)
  }

  const handleDesignBlur = (index: number) => {
    if (editingDesignValue !== designs[index]) {
      const newDesigns = [...designs]
      newDesigns[index] = editingDesignValue
      setDesigns(newDesigns)
      
      if (selectedDesign === designs[index]) {
        setSelectedDesign(editingDesignValue)
        setDesignName(editingDesignValue)
      }
    }
    setEditingDesignId(null)
  }

  const handleDesignKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setEditingDesignValue(designs[index])
      setEditingDesignId(null)
    }
  }

  const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingDesignValue(e.target.value)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = () => {
    setUploadedImage(null)
  }

  const handleSave = () => {
    // TODO: API 호출
    console.log('Save project:', {
      projectName,
      projectDescription,
      platform,
      category,
      selectedFeedbackTypes,
      selectedDesign,
      designName,
      customQuestions: customQuestions.filter((q) => q.trim() !== ''),
      selectedQuestionCategory,
      selectedQuestions,
      isResolved,
    })
  }

  const handleDelete = () => {
    // TODO: API 호출 및 확인 모달
    console.log('Delete project')
  }

  return (
    <Layout>
      <div className="registration-page">
        <div className="registration-container">
          {/* 왼쪽 사이드바 */}
          <div className={`registration-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M4 8H28M4 16H28M4 24H28"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 프로젝트 정보 섹션 */}
            {!isSidebarCollapsed && (
            <div className="sidebar-section">
              <div className="section-header">
                <h2>Register Your Projects</h2>
              </div>
              <div className="section-content">
                <Input
                  id="project-name"
                  placeholder="Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="registration-input"
                />
                <Input
                  id="project-description"
                  placeholder="Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="registration-input"
                />
              </div>

              {/* Platform Toggle */}
              <div className={`platform-toggle ${platform === 'web' ? 'toggle-web-on' : 'toggle-web-off'}`}>
                {platform === 'web' ? (
                  <>
                    <button
                      className="platform-toggle-text"
                      onClick={() => setPlatform('app')}
                    >
                      App
                    </button>
                    <button
                      className="platform-toggle-btn active"
                      onClick={() => setPlatform('web')}
                    >
                      Web
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="platform-toggle-btn active"
                      onClick={() => setPlatform('app')}
                    >
                      App
                    </button>
                    <button
                      className="platform-toggle-text"
                      onClick={() => setPlatform('web')}
                    >
                      Web
                    </button>
                  </>
                )}
              </div>
            </div>
            )}

            {/* Category 섹션 */}
            {!isSidebarCollapsed && (
            <div className="sidebar-section">
              <div className="section-header">
                <h2>Category</h2>
              </div>
              <div className="section-content">
                <Select
                  id="category"
                  options={[
                    { value: '', label: 'Select' },
                    { value: '1', label: 'Category 1' },
                    { value: '2', label: 'Category 2' },
                  ]}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="registration-select"
                />
              </div>
            </div>
            )}

            {/* 피드백 타입 섹션 */}
            {!isSidebarCollapsed && (
            <div className="sidebar-section">
              <div className="section-header">
                <h2>Desired Feedback Type</h2>
              </div>
              <div className="section-content">
                {feedbackTypes.map((type) => (
                  <div key={type} className="feedback-type-item">
                    <Checkbox
                      id={`feedback-${type}`}
                      checked={selectedFeedbackTypes.includes(type)}
                      onChange={(e) => handleFeedbackTypeChange(type, e.target.checked)}
                      className="feedback-type-checkbox"
                    />
                    <label htmlFor={`feedback-${type}`} className="feedback-type-label">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* 디자인 목록 섹션 */}
            {!isSidebarCollapsed && (
            <div className="sidebar-section">
              <div className="section-header">
                <h2>Your Designs</h2>
              </div>
              <div className="section-content">
                {designs.map((design, index) => {
                  const designKey = `design-${index}`
                  const isEditing = editingDesignId === designKey
                  const isSelected = selectedDesign === design

                  return isEditing ? (
                    <input
                      key={designKey}
                      ref={inputRef}
                      type="text"
                      value={editingDesignValue}
                      onChange={handleDesignChange}
                      onBlur={() => handleDesignBlur(index)}
                      onKeyDown={(e) => handleDesignKeyDown(e, index)}
                      className="design-item design-item-editing"
                      autoFocus
                    />
                  ) : (
                    <button
                      key={designKey}
                      className={`design-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleDesignClick(design, index)}
                      onDoubleClick={(e) => handleDesignDoubleClick(design, index, e)}
                    >
                      {design}
                    </button>
                  )
                })}
              </div>
              <Button onClick={handleAddDesign} variant="primary" className="add-design-btn">
                <span className="plus-icon">+</span>
                화면 추가
              </Button>
            </div>
            )}
          </div>

          {/* 오른쪽 메인 영역 */}
          <div className="registration-main">
            {/* 상단 액션 버튼 */}
            <div className="main-header">
              <div className="resolved-toggle">
                <button
                  className={`toggle-btn ${!isResolved ? 'active' : ''}`}
                  onClick={() => setIsResolved(false)}
                >
                  Unresolved
                </button>
                <button
                  className={`toggle-btn ${isResolved ? 'active' : ''}`}
                  onClick={() => setIsResolved(true)}
                >
                  Resolved
                </button>
              </div>
              <div className="action-buttons">
                <Button onClick={handleDelete} variant="danger" className="action-btn">
                  Delete
                </Button>
                <Button onClick={handleSave} variant="primary" className="action-btn">
                  Save
                </Button>
              </div>
            </div>

            {/* 이미지 업로드 영역 */}
            <div className="image-upload-area">
              {uploadedImage ? (
                <div className="uploaded-image-wrapper">
                  <img src={uploadedImage} alt="Uploaded design" className="uploaded-image" />
                  <div className="image-actions">
                    <label className="image-action-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <path
                          d="M15 10V20M10 15H20"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="15" cy="15" r="14" stroke="white" strokeWidth="2" />
                      </svg>
                    </label>
                    <button className="image-action-btn" onClick={handleDeleteImage}>
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <path
                          d="M10 10L20 20M20 10L10 20"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="image-upload-placeholder">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="placeholder-content">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <path
                        d="M30 20V40M20 30H40"
                        stroke="#C3C3C3"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="30" cy="30" r="28" stroke="#C3C3C3" strokeWidth="2" />
                    </svg>
                    <p>이미지를 업로드하세요</p>
                  </div>
                </label>
              )}
            </div>

            {/* 디자인 이름 */}
            <div className="main-section">
              <div className="section-header">
                <h3>Design Name</h3>
              </div>
              <Input
                id="design-name"
                placeholder="Login"
                value={designName}
                onChange={(e) => {
                  const newValue = e.target.value
                  setDesignName(newValue)
                  // Your Designs 목록에서도 업데이트
                  const designIndex = designs.findIndex((d) => d === selectedDesign)
                  if (designIndex !== -1) {
                    const newDesigns = [...designs]
                    newDesigns[designIndex] = newValue
                    setDesigns(newDesigns)
                    setSelectedDesign(newValue)
                  }
                }}
                className="registration-input"
              />
            </div>

            {/* 피드백 질문 섹션 */}
            <div className="main-section">
              <div className="section-header">
                <h3>Feedback Questions</h3>
              </div>
              <div className="custom-questions-container">
                {customQuestions.map((question, index) => (
                  <div key={`custom-question-wrapper-${index}`} className="custom-question-wrapper">
                    <Input
                      id={`custom-question-${index}`}
                      placeholder="Your own questions"
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...customQuestions]
                        newQuestions[index] = e.target.value
                        setCustomQuestions(newQuestions)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          // 현재 필드가 비어있지 않고, 마지막 필드일 때만 새 필드 추가
                          if (question.trim() !== '' && index === customQuestions.length - 1) {
                            const newQuestions = [...customQuestions, '']
                            setCustomQuestions(newQuestions)
                            // 다음 입력 필드로 포커스 이동
                            setTimeout(() => {
                              const nextInput = document.getElementById(`custom-question-${index + 1}`)
                              nextInput?.focus()
                            }, 0)
                          }
                        }
                      }}
                      className="registration-input custom-question-input"
                    />
                    {question.trim() !== '' && (
                      <button
                        type="button"
                        className="custom-question-delete"
                        onClick={() => {
                          const newQuestions = [...customQuestions]
                          newQuestions[index] = ''
                          setCustomQuestions(newQuestions)
                        }}
                        aria-label="Clear input"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L12 12M12 1L1 12"
                            stroke="#c3c3c3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Select
                id="question-category"
                options={[
                  { value: '', label: 'Select' },
                  ...questionCategories,
                ]}
                value={selectedQuestionCategory}
                onChange={(e) => setSelectedQuestionCategory(e.target.value)}
                className="registration-select"
              />
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <Checkbox
                      id={`question-${index}`}
                      checked={selectedQuestions.includes(question)}
                      onChange={() => handleQuestionToggle(question)}
                      className="question-checkbox"
                    />
                    <label htmlFor={`question-${index}`} className="question-label">
                      {question}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

