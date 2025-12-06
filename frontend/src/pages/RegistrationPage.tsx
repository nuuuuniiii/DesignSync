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
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [designs, setDesigns] = useState<string[]>([])
  const [designInputs, setDesignInputs] = useState<string[]>([''])
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null)
  const [editingDesignValue, setEditingDesignValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 각 디자인별 데이터 관리
  interface DesignData {
    name: string
    customQuestions: string[]
    selectedQuestionCategory: string
    selectedQuestions: string[]
    uploadedImages: string[]
  }
  
  const [designsData, setDesignsData] = useState<Record<string, DesignData>>({})
  
  // 현재 선택된 디자인의 데이터
  const currentDesignData = selectedDesign ? designsData[selectedDesign] : null
  const designName = currentDesignData?.name || ''
  const customQuestions = currentDesignData?.customQuestions || ['']
  const selectedQuestionCategory = currentDesignData?.selectedQuestionCategory || ''
  const selectedQuestions = currentDesignData?.selectedQuestions || []
  const uploadedImages = currentDesignData?.uploadedImages || []
  const [isResolved, setIsResolved] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false)

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
    if (!selectedDesign) return
    
    const newSelectedQuestions = selectedQuestions.includes(question)
      ? selectedQuestions.filter((q) => q !== question)
      : [...selectedQuestions, question]
    
    setDesignsData({
      ...designsData,
      [selectedDesign]: {
        ...designsData[selectedDesign],
        selectedQuestions: newSelectedQuestions,
      },
    })
  }

  const handleAddDesign = () => {
    setDesignInputs([...designInputs, ''])
  }

  const handleDesignInputChange = (index: number, value: string) => {
    const newInputs = [...designInputs]
    newInputs[index] = value
    setDesignInputs(newInputs)
    
    // 입력값이 있으면 designs 배열에 추가/업데이트
    if (value.trim() !== '') {
      const newDesigns = [...designs]
      if (newDesigns[index]) {
        newDesigns[index] = value
      } else {
        newDesigns[index] = value
      }
      setDesigns(newDesigns)
      if (selectedDesign === designs[index] || selectedDesign === null) {
        setSelectedDesign(value)
        setDesignName(value)
      }
    }
  }

  const handleDesignInputClick = (index: number) => {
    // 한 번 클릭: 디자인 선택
    const designName = designs[index] || designInputs[index]
    if (designName && designName.trim() !== '') {
      setSelectedDesign(designName)
      
      // 해당 디자인의 데이터가 없으면 초기화
      if (!designsData[designName]) {
        setDesignsData({
          ...designsData,
          [designName]: {
            name: designName,
            customQuestions: [''],
            selectedQuestionCategory: '',
            selectedQuestions: [],
            uploadedImages: [],
          },
        })
      }
    }
  }

  const handleDesignInputDoubleClick = (index: number, e: React.MouseEvent) => {
    // 두 번 클릭: 편집 모드
    e.preventDefault()
    e.stopPropagation()
    const designName = designs[index] || designInputs[index]
    setEditingDesignValue(designName || '')
    setEditingDesignId(`design-input-${index}`)
  }

  const handleDesignInputBlur = (index: number) => {
    // 편집 모드 종료
    if (editingDesignId === `design-input-${index}`) {
      const newInputs = [...designInputs]
      newInputs[index] = editingDesignValue
      setDesignInputs(newInputs)
      
      if (editingDesignValue.trim() !== '') {
        const oldDesignName = designs[index]
        const newDesigns = [...designs]
        newDesigns[index] = editingDesignValue
        setDesigns(newDesigns)
        
        // 디자인 이름이 변경된 경우 데이터도 업데이트
        if (oldDesignName && oldDesignName !== editingDesignValue) {
          const oldData = designsData[oldDesignName]
          if (oldData) {
            setDesignsData({
              ...designsData,
              [editingDesignValue]: {
                ...oldData,
                name: editingDesignValue,
              },
            })
            delete designsData[oldDesignName]
          }
        }
        
        if (selectedDesign === oldDesignName || selectedDesign === null) {
          setSelectedDesign(editingDesignValue)
          
          // 해당 디자인의 데이터가 없으면 초기화
          if (!designsData[editingDesignValue]) {
            setDesignsData({
              ...designsData,
              [editingDesignValue]: {
                name: editingDesignValue,
                customQuestions: [''],
                selectedQuestionCategory: '',
                selectedQuestions: [],
                uploadedImages: [],
              },
            })
          }
        }
      }
    }
    setEditingDesignId(null)
  }

  const handleDesignInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setEditingDesignValue(designs[index] || designInputs[index] || '')
      setEditingDesignId(null)
    }
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
    const files = e.target.files
    if (!files || files.length === 0) {
      e.target.value = ''
      return
    }

    const fileArray = Array.from(files)
    const readers = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string)
          } else {
            reject(new Error('Failed to read file'))
          }
        }
        reader.onerror = () => {
          reject(new Error('Failed to read file'))
        }
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(readers).then((imageUrls) => {
      const targetDesign = selectedDesign || (designInputs[0] && designInputs[0].trim() !== '' ? designInputs[0] : null)
      
      if (!targetDesign) {
        // 디자인이 없으면 기본 디자인 생성
        const defaultDesignName = 'Design 1'
        setSelectedDesign(defaultDesignName)
        setDesigns(prev => {
          if (!prev.includes(defaultDesignName)) {
            return [...prev, defaultDesignName]
          }
          return prev
        })
        setDesignInputs(prev => {
          const updated = [...prev]
          if (updated[0] === '') {
            updated[0] = defaultDesignName
          }
          return updated
        })
        
        setDesignsData(prev => ({
          ...prev,
          [defaultDesignName]: {
            name: defaultDesignName,
            customQuestions: [''],
            selectedQuestionCategory: '',
            selectedQuestions: [],
            uploadedImages: imageUrls,
          },
        }))
      } else {
        // 디자인이 있으면 해당 디자인에 이미지 추가
        setDesignsData(prev => ({
          ...prev,
          [targetDesign]: {
            ...(prev[targetDesign] || {
              name: targetDesign,
              customQuestions: [''],
              selectedQuestionCategory: '',
              selectedQuestions: [],
              uploadedImages: [],
            }),
            uploadedImages: [...(prev[targetDesign]?.uploadedImages || []), ...imageUrls],
          },
        }))
        
        // 디자인이 선택되지 않았으면 선택
        if (!selectedDesign) {
          setSelectedDesign(targetDesign)
          setDesigns(prev => {
            if (!prev.includes(targetDesign)) {
              return [...prev, targetDesign]
            }
            return prev
          })
        }
      }
    }).catch((error) => {
      console.error('Image upload error:', error)
    })
    
    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    e.target.value = ''
  }

  const handleDeleteImage = (index: number) => {
    if (!selectedDesign) return
    
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setDesignsData({
      ...designsData,
      [selectedDesign]: {
        ...designsData[selectedDesign],
        uploadedImages: newImages,
      },
    })
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

  const handleDeleteDesign = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newDesigns = designs.filter((_, i) => i !== index)
    setDesigns(newDesigns)
    
    // 삭제된 디자인이 선택된 디자인이었다면, 첫 번째 디자인 선택
    if (selectedDesign === designs[index]) {
      if (newDesigns.length > 0) {
        setSelectedDesign(newDesigns[0])
        setDesignName(newDesigns[0])
      } else {
        setSelectedDesign('')
        setDesignName('')
      }
    }
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
                    { value: 'ecommerce', label: 'E-Commerce' },
                    { value: 'business', label: 'Business' },
                    { value: 'lifestyle', label: 'Lifestyle' },
                    { value: 'media', label: 'Media' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'technology', label: 'Technology' },
                    { value: 'social', label: 'Social' },
                    { value: 'government', label: 'Government' },
                    { value: 'entertainment', label: 'Entertainment' },
                    { value: 'wellness', label: 'Wellness' },
                    { value: 'education', label: 'Education' },
                    { value: 'travel', label: 'Travel' },
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
                <div className="designs-input-wrapper">
                  {designInputs.map((input, index) => {
                    const designKey = `design-input-${index}`
                    const isEditing = editingDesignId === designKey
                    const designName = designs[index] || input
                    const isSelected = selectedDesign === designName && designName.trim() !== ''
                    
                    return (
                      <div key={designKey} className="design-item-wrapper">
                        <input
                          type="text"
                          className={`design-input ${isSelected ? 'active' : ''} ${isEditing ? 'editing' : ''}`}
                          placeholder="What is your Screen name?"
                          value={isEditing ? editingDesignValue : input}
                          readOnly={!isEditing}
                          onClick={() => handleDesignInputClick(index)}
                          onDoubleClick={(e) => handleDesignInputDoubleClick(index, e)}
                          onChange={(e) => {
                            if (isEditing) {
                              setEditingDesignValue(e.target.value)
                            } else {
                              handleDesignInputChange(index, e.target.value)
                            }
                          }}
                          onBlur={() => {
                            if (isEditing) {
                              handleDesignInputBlur(index)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (isEditing) {
                              handleDesignInputKeyDown(e, index)
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="design-delete-btn"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const designToDelete = designs[index] || designInputs[index]
                            const newInputs = designInputs.filter((_, i) => i !== index)
                            const newDesigns = designs.filter((_, i) => i !== index)
                            setDesignInputs(newInputs)
                            setDesigns(newDesigns)
                            
                            // designsData에서도 삭제
                            if (designToDelete && designsData[designToDelete]) {
                              const newDesignsData = { ...designsData }
                              delete newDesignsData[designToDelete]
                              setDesignsData(newDesignsData)
                            }
                            
                            if (selectedDesign === designToDelete) {
                              if (newDesigns.length > 0) {
                                const nextDesign = newDesigns[0]
                                setSelectedDesign(nextDesign)
                                if (!designsData[nextDesign]) {
                                  setDesignsData({
                                    ...designsData,
                                    [nextDesign]: {
                                      name: nextDesign,
                                      customQuestions: [''],
                                      selectedQuestionCategory: '',
                                      selectedQuestions: [],
                                      uploadedImages: [],
                                    },
                                  })
                                }
                              } else {
                                setSelectedDesign(null)
                              }
                            }
                          }}
                          aria-label="Delete design"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4 4L12 12M12 4L4 12"
                              stroke="#c3c3c3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
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
                <Button onClick={handleSave} variant="primary" className="action-btn">
                  Save
                </Button>
              </div>
            </div>

            {/* 이미지 업로드 영역 */}
            <div className="image-upload-area">
              {uploadedImages.length > 0 ? (
                <div className="uploaded-images-container">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="uploaded-image-wrapper">
                      <img src={image} alt={`Uploaded design ${index + 1}`} className="uploaded-image" />
                      <div className="image-actions">
                        <label className="image-action-btn image-action-upload">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <foreignObject x="-6.66667" y="-6.66667" width="63.3333" height="63.3333">
                              <div xmlns="http://www.w3.org/1999/xhtml" style={{ backdropFilter: 'blur(3.33px)', clipPath: `url(#bgblur_0_5_2221_clip_path_${index})`, height: '100%', width: '100%' }}></div>
                            </foreignObject>
                            <g data-figma-bg-blur-radius="6.66667">
                              <rect width="50" height="50" rx="6.66667" fill="#222222" fillOpacity="0.5"/>
                              <path d="M17.502 35C16.8145 35 16.2261 34.7554 15.737 34.2663C15.2478 33.7771 15.0028 33.1884 15.002 32.5V30C15.002 29.6459 15.122 29.3492 15.362 29.11C15.602 28.8709 15.8986 28.7509 16.252 28.75C16.6053 28.7492 16.9024 28.8692 17.1432 29.11C17.384 29.3509 17.5036 29.6475 17.502 30V32.5H32.502V30C32.502 29.6459 32.622 29.3492 32.862 29.11C33.102 28.8709 33.3986 28.7509 33.752 28.75C34.1053 28.7492 34.4024 28.8692 34.6432 29.11C34.884 29.3509 35.0036 29.6475 35.002 30V32.5C35.002 33.1875 34.7574 33.7763 34.2682 34.2663C33.779 34.7563 33.1903 35.0009 32.502 35H17.502ZM23.752 19.8125L21.4082 22.1563C21.1582 22.4063 20.8615 22.5263 20.5182 22.5163C20.1749 22.5063 19.8778 22.3759 19.627 22.125C19.3978 21.875 19.2778 21.5834 19.267 21.25C19.2561 20.9167 19.3761 20.625 19.627 20.375L24.127 15.875C24.252 15.75 24.3874 15.6617 24.5332 15.61C24.679 15.5584 24.8353 15.5321 25.002 15.5313C25.1686 15.5304 25.3249 15.5567 25.4707 15.61C25.6165 15.6634 25.752 15.7517 25.877 15.875L30.377 20.375C30.627 20.625 30.747 20.9167 30.737 21.25C30.727 21.5834 30.607 21.875 30.377 22.125C30.127 22.375 29.8303 22.5054 29.487 22.5163C29.1436 22.5271 28.8465 22.4071 28.5957 22.1563L26.252 19.8125V28.75C26.252 29.1042 26.132 29.4013 25.892 29.6413C25.652 29.8813 25.3553 30.0009 25.002 30C24.6486 29.9992 24.352 29.8792 24.112 29.64C23.872 29.4009 23.752 29.1042 23.752 28.75V19.8125Z" fill="white"/>
                            </g>
                            <defs>
                              <clipPath id={`bgblur_0_5_2221_clip_path_${index}`} transform="translate(6.66667 6.66667)">
                                <rect width="50" height="50" rx="6.66667"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </label>
                        <button className="image-action-btn image-action-delete" onClick={() => handleDeleteImage(index)}>
                          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <foreignObject x="-6.66667" y="-6.66667" width="63.3333" height="63.3333">
                              <div xmlns="http://www.w3.org/1999/xhtml" style={{ backdropFilter: 'blur(3.33px)', clipPath: `url(#bgblur_0_5_2222_clip_path_${index})`, height: '100%', width: '100%' }}></div>
                            </foreignObject>
                            <g data-figma-bg-blur-radius="6.66667">
                              <rect width="50" height="50" rx="6.66667" fill="#222222" fillOpacity="0.5"/>
                              <path d="M34.998 16.25C35.3296 16.25 35.6475 16.3817 35.8819 16.6161C36.1164 16.8505 36.248 17.1685 36.248 17.5C36.248 17.8315 36.1164 18.1495 35.8819 18.3839C35.6475 18.6183 35.3296 18.75 34.998 18.75H33.748L33.7443 18.8388L32.578 35.1775C32.5332 35.8082 32.2509 36.3985 31.7882 36.8295C31.3255 37.2604 30.7166 37.5 30.0843 37.5H19.9105C19.2782 37.5 18.6694 37.2604 18.2067 36.8295C17.7439 36.3985 17.4617 35.8082 17.4168 35.1775L16.2505 18.84L16.248 18.75H14.998C14.6665 18.75 14.3486 18.6183 14.1142 18.3839C13.8797 18.1495 13.748 17.8315 13.748 17.5C13.748 17.1685 13.8797 16.8505 14.1142 16.6161C14.3486 16.3817 14.6665 16.25 14.998 16.25H34.998ZM31.2443 18.75H18.7518L19.9118 35H30.0843L31.2443 18.75ZM27.498 12.5C27.8296 12.5 28.1475 12.6317 28.3819 12.8661C28.6164 13.1005 28.748 13.4185 28.748 13.75C28.748 14.0815 28.6164 14.3995 28.3819 14.6339C28.1475 14.8683 27.8296 15 27.498 15H22.498C22.1665 15 21.8486 14.8683 21.6142 14.6339C21.3797 14.3995 21.248 14.0815 21.248 13.75C21.248 13.4185 21.3797 13.1005 21.6142 12.8661C21.8486 12.6317 22.1665 12.5 22.498 12.5H27.498Z" fill="white"/>
                            </g>
                            <defs>
                              <clipPath id={`bgblur_0_5_2222_clip_path_${index}`} transform="translate(6.66667 6.66667)">
                                <rect width="50" height="50" rx="6.66667"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <label className="image-upload-placeholder">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
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
                placeholder="What is your Screen name?"
                value={designName}
                onChange={(e) => {
                  if (!selectedDesign) return
                  
                  const newValue = e.target.value
                  setDesignsData({
                    ...designsData,
                    [selectedDesign]: {
                      ...designsData[selectedDesign],
                      name: newValue,
                    },
                  })
                  
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
                disabled={!selectedDesign}
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
                        if (!selectedDesign) return
                        
                        const newQuestions = [...customQuestions]
                        newQuestions[index] = e.target.value
                        setDesignsData({
                          ...designsData,
                          [selectedDesign]: {
                            ...designsData[selectedDesign],
                            customQuestions: newQuestions,
                          },
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          // 현재 필드가 비어있지 않고, 마지막 필드일 때만 새 필드 추가
                          if (question.trim() !== '' && index === customQuestions.length - 1) {
                            if (!selectedDesign) return
                            
                            const newQuestions = [...customQuestions, '']
                            setDesignsData({
                              ...designsData,
                              [selectedDesign]: {
                                ...designsData[selectedDesign],
                                customQuestions: newQuestions,
                              },
                            })
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
                          if (!selectedDesign) return
                          
                          const newQuestions = [...customQuestions]
                          newQuestions[index] = ''
                          setDesignsData({
                            ...designsData,
                            [selectedDesign]: {
                              ...designsData[selectedDesign],
                              customQuestions: newQuestions,
                            },
                          })
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
              <div className="question-category-wrapper">
                <Select
                  id="question-category"
                  options={[
                    { value: '', label: 'Select' },
                    ...questionCategories,
                  ]}
                  value={selectedQuestionCategory}
                  onChange={(e) => {
                    if (!selectedDesign) return
                    
                    setDesignsData({
                      ...designsData,
                      [selectedDesign]: {
                        ...designsData[selectedDesign],
                        selectedQuestionCategory: e.target.value,
                      },
                    })
                    // Select 변경 시 Question List 닫기
                    setIsQuestionListOpen(false)
                  }}
                  onClick={(e) => {
                    // Select 필드 클릭 시 Question List 닫기
                    setIsQuestionListOpen(false)
                  }}
                  className="registration-select"
                  disabled={!selectedDesign}
                />
                <div 
                  className="select-dropdown-toggle"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (selectedDesign) {
                      setIsQuestionListOpen(!isQuestionListOpen)
                    }
                  }}
                />
              </div>
              {isQuestionListOpen && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

