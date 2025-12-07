import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { GNB } from '@/components/Layout/GNB'
import { StarRating } from '@/components/StarRating/StarRating'
import { FeedbackItem } from '@/components/FeedbackItem/FeedbackItem'
import { getProjectById, ProjectWithDetails } from '@/api/projects'
import { useAuth } from '@/contexts/AuthContext'
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
  
  const [project, setProject] = useState<ProjectWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const { user } = useAuth()

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
          setProject(projectData)
          
          // 첫 번째 디자인 선택
          if (projectData.designs && projectData.designs.length > 0) {
            setSelectedDesign(projectData.designs[0].name)
          }
        } else {
          setError(result.error || '프로젝트를 불러오는데 실패했습니다.')
        }
      } catch (err: any) {
        setError(err.message || '프로젝트를 불러오는 중 오류가 발생했습니다.')
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
    const feedbacksSection = document.querySelector('.project-overview-feedbacks-section')
    if (feedbacksSection) {
      feedbacksSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMenuAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    console.log(action, feedbackId)
  }

  const handleAddFeedback = () => {
    if (!projectId) return
    const webPath = location.pathname.includes('/web') ? '/web' : ''
    navigate(`/projects/${projectId}${webPath}/feedback/rating`)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="project-overview-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (error || !project) {
    return (
      <div className="project-overview-page">
        <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
          {error || '프로젝트를 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  // 선택된 디자인의 이미지 가져오기
  const selectedDesignData = project.designs?.find((d) => d.name === selectedDesign)
  const screens = selectedDesignData?.images || []
  const questions = selectedDesignData?.questions || []

  // 질문을 FeedbackItem 형식으로 변환
  const formattedQuestions = questions.map((q, index) => {
    // 백엔드에서 받아온 피드백 데이터를 FeedbackItem 형식으로 변환
    const feedbacksData = (q.feedbacks || []).map((fb) => ({
      id: fb.id,
      screenNumber: fb.screen_number || 1, // screen_number가 null이면 1로 기본값 설정
      author: fb.user_name || '익명',
      content: fb.feedback_text,
      isMyComment: user?.id && fb.user_id ? user.id === fb.user_id : false,
    }))

    return {
      id: q.id,
      number: `${index + 1}`,
      text: q.question_text,
      feedbacks: feedbacksData,
    }
  })

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
  const averageRatings = project.average_ratings || {}
  const ratingTypes = allFeedbackTypes
    .filter((type) => selectedFeedbackTypes.includes(type))
    .map((type, index) => ({
      id: `${index + 1}`,
      name: type,
      rating: averageRatings[type] || 0, // 평균 별점 표시
    }))

  const leftRatings = ratingTypes.slice(0, Math.ceil(ratingTypes.length / 2))
  const rightRatings = ratingTypes.slice(Math.ceil(ratingTypes.length / 2))

  // Creator 정보는 추후 API에서 가져오기
  const creator = 'User'

  return (
    <div className="project-overview-page">
      <GNB selectedPlatform={isApp ? 'apps' : 'web'} />
      
      {/* Project Detail Header */}
      <div className="project-overview-header">
        <div className="project-overview-header-top">
          <div className="project-overview-info">
            <p className="project-overview-creator">{creator}</p>
            <h1 className="project-overview-title">{project.name}</h1>
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
            <p className="project-overview-category-text">{project.description || ''}</p>
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
              <p className="project-overview-section-value">{project.category}</p>
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
                  {project.designs && project.designs.length > 0 ? (
                    project.designs.map((design) => (
                      <button
                        key={design.id}
                        className={`project-overview-design-item ${selectedDesign === design.name ? 'selected' : ''}`}
                        onClick={() => handleDesignSelect(design.name)}
                      >
                        {design.name}
                      </button>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontSize: '14px' }}>등록된 디자인이 없습니다.</p>
                  )}
                </div>
              </div>

              {/* Screen/Feedback Section */}
              <div className="project-overview-screen-feedback-section">
                {/* Screen Images Section */}
                <div className={`project-overview-screens-container ${isApp ? 'project-overview-screens-app' : 'project-overview-screens-web'}`}>
                  {screens.length > 0 ? (
                    screens.map((image) => (
                      <div
                        key={image.id}
                        className={`project-overview-screen-card ${isApp ? 'project-overview-screen-card-app' : 'project-overview-screen-card-web'}`}
                        onClick={() => handleScreenClick(image.id)}
                      >
                        <div className="project-overview-screen-image-wrapper">
                          <img 
                            src={image.cloudinary_url} 
                            alt={`Screen ${image.screen_number}`} 
                            className="project-overview-screen-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        {!isApp && (
                          <div className="project-overview-screen-badge-wrapper">
                            <div className="project-overview-screen-number-badge">
                              <span>{image.screen_number}</span>
                            </div>
                          </div>
                        )}
                        {isApp && (
                          <div className="project-overview-screen-number-badge">
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
                <div className="project-overview-feedbacks-section">
                  <p className="project-overview-section-label">Feedbacks</p>
                  <div className="project-overview-feedbacks-list">
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
