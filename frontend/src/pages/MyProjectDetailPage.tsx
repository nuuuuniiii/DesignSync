import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { StarRating } from '@/components/StarRating/StarRating'
import { FeedbackItem } from '@/components/FeedbackItem/FeedbackItem'
import { getProjectById, ProjectWithDetails } from '@/api/projects'
import './my-project-detail.css'

/**
 * My Project Detail 화면
 *
 * Figma 디자인:
 * - https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=99-10713&m=dev
 */
export const MyProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const _navigate = useNavigate()
  const location = useLocation()
  
  // URL 경로에 따라 app 여부 판단: /web이면 app=false (app=off), 아니면 app=true (app=on)
  // My Project Web에서 카드 클릭 시 /my-projects/:projectId/web 경로로 이동하므로 isApp = false
  // My Project App에서 카드 클릭 시 /my-projects/:projectId 경로로 이동하므로 isApp = true
  const isApp = !location.pathname.includes('/web')
  
  const [project, setProject] = useState<ProjectWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)

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
          
          // 디버깅: 데이터 확인
          console.log('📦 [MyProjectDetail] 프로젝트 데이터:', projectData)
          console.log('📦 [MyProjectDetail] Designs 배열:', projectData.designs)
          console.log('📦 [MyProjectDetail] Designs 개수:', projectData.designs?.length || 0)
          if (projectData.designs) {
            projectData.designs.forEach((design, index) => {
              console.log(`📦 [MyProjectDetail] Design ${index + 1}:`, {
                id: design.id,
                name: design.name,
                imagesCount: design.images?.length || 0,
                questionsCount: design.questions?.length || 0,
              })
            })
          }
          
          setProject(projectData)
          
          // 첫 번째 디자인 선택
          if (projectData.designs && projectData.designs.length > 0) {
            setSelectedDesign(projectData.designs[0].name)
            console.log('📦 [MyProjectDetail] 선택된 첫 번째 디자인:', projectData.designs[0].name)
          } else {
            console.warn('📦 [MyProjectDetail] 디자인이 없습니다.')
          }
        } else {
          setError(result.error || '프로젝트를 불러오는데 실패했습니다.')
        }
      } catch (err: unknown) {
        console.error('프로젝트 불러오기 에러:', err)
        const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleDesignSelect = (designName: string) => {
    setSelectedDesign(designName)
  }

  const handleScreenClick = (_screenId: string) => {
    // Scroll to Feedbacks section
    const feedbacksSection = document.querySelector('.my-project-feedbacks-section')
    if (feedbacksSection) {
      feedbacksSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMenuAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    console.log(action, feedbackId)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="my-project-detail-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (error || !project) {
    return (
      <div className="my-project-detail-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
          {error || '프로젝트를 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  // 선택된 디자인의 이미지 및 질문 가져오기
  const selectedDesignData = project.designs?.find((d) => d.name === selectedDesign)
  const screens = selectedDesignData?.images || []
  const questions = selectedDesignData?.questions || []

  // 질문을 FeedbackItem 형식으로 변환
  const formattedQuestions = questions.map((q, index) => ({
    id: q.id,
    number: `${index + 1}`,
    text: q.question_text,
    feedbacks: [], // 피드백은 추후 API 연동
  }))

  // 선택한 피드백 타입만 별점 표시
  const allFeedbackTypes = [
    'User Flow',
    'Interaction Design',
    'Visual Design',
    'UX Writing',
    'Information Architecture',
    'Usability',
  ]

  // 프로젝트에서 선택한 피드백 타입만 필터링
  const selectedFeedbackTypes = project.feedback_types || []
  const ratingTypes = allFeedbackTypes
    .filter((type) => selectedFeedbackTypes.includes(type))
    .map((type, index) => ({
      id: `${index + 1}`,
      name: type,
      rating: 0, // 추후 API 연동 시 실제 평균 별점 표시
    }))

  const leftRatings = ratingTypes.slice(0, Math.ceil(ratingTypes.length / 2))
  const rightRatings = ratingTypes.slice(Math.ceil(ratingTypes.length / 2))

  return (
    <div className="my-project-detail-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      {/* Project Detail Header */}
      <div className="my-project-detail-header">
        <div className="my-project-header-top">
          <div className="my-project-info">
            <p className="my-project-creator">My project</p>
            <h1 className="my-project-title">{project.name}</h1>
          </div>
        </div>
        <div className="my-project-header-bottom">
          <div className="my-project-platform-category-field">
            <div className="my-project-platform-tag">{isApp ? 'App' : 'Web'}</div>
            <p className="my-project-category-text">{project.description || ''}</p>
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
              <p className="my-project-section-value">{project.category}</p>
            </div>

            <div className="my-project-rating-section">
              <p className="my-project-section-label">Rating</p>
              {ratingTypes.length > 0 ? (
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
              ) : (
                <p style={{ color: '#999', fontSize: '14px', padding: '10px 0' }}>
                  등록된 피드백 타입이 없습니다.
                </p>
              )}
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
                  {project.designs && project.designs.length > 0 ? (
                    <>
                      {console.log('🎨 [MyProjectDetail] 렌더링할 Designs:', project.designs.map(d => ({ id: d.id, name: d.name })))}
                      {project.designs.map((design) => (
                        <button
                          key={design.id}
                          className={`my-project-design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                          onClick={() => handleDesignSelect(design.name)}
                        >
                          {design.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    <p style={{ color: '#999', fontSize: '14px' }}>등록된 디자인이 없습니다.</p>
                  )}
                </div>
              </div>

              {/* Screen/Feedback Section */}
              <div className="my-project-screen-feedback-section">
                {/* Screen Images Section */}
                <div className={`my-project-screens-container ${isApp ? 'my-project-screens-app' : 'my-project-screens-web'}`}>
                  {screens.length > 0 ? (
                    screens.map((image) => (
                      <div
                        key={image.id}
                        className={`my-project-screen-card ${isApp ? 'my-project-screen-card-app' : 'my-project-screen-card-web'}`}
                        onClick={() => handleScreenClick(image.id)}
                      >
                        <div className="my-project-screen-image-wrapper">
                          <img 
                            src={image.cloudinary_url} 
                            alt={`Screen ${image.screen_number}`} 
                            className="my-project-screen-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        {!isApp && (
                          <div className="my-project-screen-badge-wrapper">
                            <div className="my-project-screen-number-badge">
                              <span>{image.screen_number}</span>
                            </div>
                          </div>
                        )}
                        {isApp && (
                          <div className="my-project-screen-number-badge">
                            <span>{image.screen_number}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontSize: '14px', padding: '20px' }}>
                      {selectedDesign ? '이 디자인에 등록된 이미지가 없습니다.' : '디자인을 선택해주세요.'}
                    </p>
                  )}
                </div>

                {/* Feedbacks Section */}
                <div className="my-project-feedbacks-section">
                  <p className="my-project-section-label">Feedbacks</p>
                  <div className="my-project-feedbacks-list">
                    {formattedQuestions.length > 0 ? (
                      formattedQuestions.map((question) => (
                        <FeedbackItem
                          key={question.id}
                          questionNumber={question.number}
                          question={question.text}
                          feedbacks={question.feedbacks}
                          onMenuClick={handleMenuAction}
                        />
                      ))
                    ) : (
                      <p style={{ color: '#999', fontSize: '14px', padding: '20px' }}>
                        {selectedDesign ? '이 디자인에 등록된 질문이 없습니다.' : '디자인을 선택해주세요.'}
                      </p>
                    )}
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
