import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getProjects, deleteProject, getFeedbackedProjects, Project as ApiProject } from '@/api/projects'
import { GNB } from '@/components/Layout/GNB'
import { CommentIcon } from '@/components/Icon/CommentIcon'
import { ResolvedTag } from '@/components/ResolvedTag/ResolvedTag'
import '../styles/my-page.css'

type PlatformType = 'apps' | 'web'

interface Project {
  id: string
  name: string
  subtitle?: string
  imageUrl?: string
  hasNewFeedback?: boolean
  isResolved?: boolean
}

// API Project를 화면용 Project로 변환
const convertApiProjectToDisplayProject = (apiProject: ApiProject): Project => {
  return {
    id: apiProject.id,
    name: apiProject.name,
    subtitle: apiProject.description || undefined,
    imageUrl: apiProject.thumbnail_url || undefined,
    hasNewFeedback: false, // TODO: 피드백 확인 로직 추가
    isResolved: apiProject.status === 'resolved',
  }
}

/**
 * My Page 화면
 *
 * Figma 디자인:
 * - 메인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=53-6703&m=dev
 * - 컴포넌트: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=98-8816&m=dev
 * - 컴포넌트: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=98-9292&m=dev
 *
 * 구성 요소:
 * - My Project 섹션: 내가 등록한 프로젝트 목록, Select 모드 지원
 * - My Feedback 섹션: 내가 피드백을 남긴 프로젝트 목록
 */
export const MyPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const [myProjectPlatform, setMyProjectPlatform] = useState<PlatformType>('apps')
  const [myFeedbackPlatform, setMyFeedbackPlatform] = useState<PlatformType>('apps')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [feedbackProjects, setFeedbackProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 프로젝트 등록 후 My Page로 돌아왔을 때 플랫폼 필터 자동 설정
  useEffect(() => {
    const state = location.state as { fromRegistration?: boolean; platform?: 'web' | 'app' } | null
    if (state?.fromRegistration && state?.platform) {
      const platformType: PlatformType = state.platform === 'web' ? 'web' : 'apps'
      setMyProjectPlatform(platformType)
      // state 초기화 (한 번만 적용)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  // My Project 목록 가져오기 함수
  const fetchMyProjects = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const platformFilter = myProjectPlatform === 'web' ? 'web' : 'app'
      const result = await getProjects({
        platform: platformFilter,
        userId: user.id,
      })

      if (result.success && result.data) {
        const convertedProjects = result.data.map(convertApiProjectToDisplayProject)
        setMyProjects(convertedProjects)
      } else {
        setError(result.error || '프로젝트 목록을 가져오는데 실패했습니다.')
        setMyProjects([])
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 목록을 가져오는 중 오류가 발생했습니다.'
      setError(errorMessage)
      setMyProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, myProjectPlatform])

  // My Project 목록 가져오기
  useEffect(() => {
    fetchMyProjects()
  }, [fetchMyProjects])

  // 페이지 포커스 시 목록 갱신 (프로젝트 등록 후 돌아왔을 때)
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === '/my-page' && isAuthenticated && user) {
        fetchMyProjects()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [location.pathname, isAuthenticated, user, fetchMyProjects])

  // location 변경 시 목록 갱신
  useEffect(() => {
    if (location.pathname === '/my-page' && isAuthenticated && user) {
      fetchMyProjects()
    }
  }, [location.pathname, isAuthenticated, user, fetchMyProjects])

  // My Feedback 목록 가져오기 함수
  const fetchFeedbackProjects = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFeedbackProjects([])
      return
    }

    try {
      const platformFilter = myFeedbackPlatform === 'web' ? 'web' : 'app'
      console.log('📝 [MyPage] 피드백 프로젝트 가져오기 시작, userId:', user.id, 'platform:', platformFilter)
      const result = await getFeedbackedProjects({
        platform: platformFilter,
      })

      console.log('📝 [MyPage] 피드백 프로젝트 결과:', result)

      if (result.success && result.data) {
        console.log('📝 [MyPage] 피드백 프로젝트 개수:', result.data.length)
        const convertedProjects = result.data.map(convertApiProjectToDisplayProject)
        setFeedbackProjects(convertedProjects)
      } else {
        console.warn('📝 [MyPage] 피드백 프로젝트 가져오기 실패:', result.error)
        setFeedbackProjects([])
      }
    } catch (err: unknown) {
      console.error('📝 [MyPage] 피드백 프로젝트 목록 가져오기 오류:', err)
      setFeedbackProjects([])
    }
  }, [isAuthenticated, user, myFeedbackPlatform])

  // My Feedback 목록 가져오기
  useEffect(() => {
    fetchFeedbackProjects()
  }, [fetchFeedbackProjects])

  const handleSelectMode = () => {
    setSelectMode(true)
    setSelectedProjects(myProjects.map((p) => p.id))
  }

  const handleProjectClick = (projectId: string) => {
    if (selectMode) {
      handleProjectSelect(projectId)
    } else {
      if (myProjectPlatform === 'apps') {
        navigate(`/my-projects/${projectId}`)
      } else {
        navigate(`/my-projects/${projectId}/web`)
      }
    }
  }

  const handleProjectSelect = (projectId: string) => {
    if (!selectMode) return
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  const handleResolved = () => {
    console.log('Resolved projects:', selectedProjects)
    setSelectedProjects([])
    setSelectMode(false)
  }

  const handleEdit = () => {
    if (selectedProjects.length === 1) {
      navigate(`/projects/${selectedProjects[0]}/edit`)
    }
  }

  const handleDelete = async () => {
    if (selectedProjects.length === 0) {
      return
    }

    // 삭제 확인
    const confirmMessage = `선택한 ${selectedProjects.length}개의 프로젝트를 삭제하시겠습니까?`
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      // 모든 선택된 프로젝트 삭제
      const deletePromises = selectedProjects.map((projectId) => deleteProject(projectId))
      const results = await Promise.allSettled(deletePromises)

      // 삭제 결과 확인
      const failedDeletes = results.filter((result) => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
      
      if (failedDeletes.length > 0) {
        alert(`일부 프로젝트 삭제에 실패했습니다. (${failedDeletes.length}/${selectedProjects.length})`)
      } else {
        // 성공적으로 삭제된 경우 목록 새로고침
        await fetchMyProjects()
      }

      // Select 모드 해제
      setSelectedProjects([])
      setSelectMode(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '프로젝트 삭제 중 오류가 발생했습니다.'
      alert(errorMessage)
      console.error('Delete projects error:', error)
    }
  }

  const handleAddProject = () => {
    navigate('/registration')
  }

  const _handleCancelSelect = () => {
    setSelectMode(false)
    setSelectedProjects([])
  }

  return (
    <div className="my-page">
      <GNB selectedPlatform={myProjectPlatform} onPlatformChange={setMyProjectPlatform} />
      
      {/* My Project Section */}
      <div className="my-project-section">
        <div className="my-project-header">
          <div className="my-project-header-left">
            <h2 className="my-project-title">My Project</h2>
            <div className="platform-filters">
              <button
                onClick={() => setMyProjectPlatform('apps')}
                className={`platform-filter ${myProjectPlatform === 'apps' ? 'active' : ''}`}
              >
                Apps
              </button>
              <button
                onClick={() => setMyProjectPlatform('web')}
                className={`platform-filter ${myProjectPlatform === 'web' ? 'active' : ''}`}
              >
                Webs
              </button>
            </div>
          </div>
          <div className="my-project-header-right">
            {!selectMode ? (
              <>
                <button onClick={handleSelectMode} className="btn-select">
                  Select
                </button>
                <button onClick={handleAddProject} className="btn-add-project">
                  <span className="plus-icon">+</span>
                  Add New Project
                </button>
              </>
            ) : (
              <div className="select-mode-buttons">
                <button
                  onClick={handleResolved}
                  className="btn-resolved"
                  disabled={selectedProjects.length === 0}
                >
                  Resolved
                </button>
                <button
                  onClick={handleEdit}
                  className="btn-edit"
                  disabled={selectedProjects.length !== 1}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-delete"
                  disabled={selectedProjects.length === 0}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="my-project-grid">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>{error}</div>
          ) : myProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>프로젝트가 없습니다. 새 프로젝트를 추가해보세요.</div>
          ) : myProjectPlatform === 'web' ? (
            // Web: 2행 × 3열
            Array.from({ length: Math.ceil(myProjects.length / 3) }, (_, rowIndex) => (
              <div key={rowIndex} className="my-project-row my-project-row-web">
                {myProjects.slice(rowIndex * 3, rowIndex * 3 + 3).map((project) => (
                  <div
                    key={project.id}
                    className="my-project-item my-project-item-web"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="my-project-card my-project-card-web">
                      <div className="my-project-image-wrapper my-project-image-wrapper-web">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={project.name} className="my-project-image" />
                        ) : (
                          <div className="my-project-placeholder"></div>
                        )}
                      </div>
                      <div className="my-project-card-overlay">
                        {selectMode ? (
                          <div className="my-project-feedback-icon-area my-project-feedback-icon-area-web">
                            {project.isResolved && (
                              <div className="my-project-resolved-tag-wrapper">
                                <ResolvedTag visible={true} />
                              </div>
                            )}
                            <div className="my-project-checkbox-wrapper">
                              <div
                                className={`my-project-checkbox ${
                                  selectedProjects.includes(project.id) ? 'checked' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleProjectSelect(project.id)
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="my-project-labels my-project-labels-web">
                            <div className="my-project-comment-icon-left">
                              <CommentIcon hasNewFeedback={true} width={32} height={32} />
                            </div>
                            {project.isResolved && (
                              <div className="my-project-resolved-tag-wrapper">
                                <ResolvedTag visible={true} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="my-project-description">
                      <h3 className="my-project-name">{project.name}</h3>
                      {project.subtitle && <p className="my-project-subtitle">{project.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            // Apps: 2행 × 4열
            Array.from({ length: Math.ceil(myProjects.length / 4) }, (_, rowIndex) => (
              <div key={rowIndex} className="my-project-row my-project-row-apps">
                {myProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                  <div
                    key={project.id}
                    className="my-project-item my-project-item-apps"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="my-project-card my-project-card-apps">
                      <div className="my-project-image-wrapper my-project-image-wrapper-apps">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={project.name} className="my-project-image" />
                        ) : (
                          <div className="my-project-placeholder"></div>
                        )}
                      </div>
                      <div className="my-project-card-overlay">
                        {selectMode ? (
                          <div className="my-project-feedback-icon-area my-project-feedback-icon-area-apps">
                            {project.isResolved && (
                              <div className="my-project-resolved-tag-wrapper">
                                <ResolvedTag visible={true} />
                              </div>
                            )}
                            <div className="my-project-checkbox-wrapper">
                              <div
                                className={`my-project-checkbox ${
                                  selectedProjects.includes(project.id) ? 'checked' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleProjectSelect(project.id)
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="my-project-labels my-project-labels-apps">
                            <div className="my-project-comment-icon-left">
                              <CommentIcon hasNewFeedback={true} width={32} height={32} />
                            </div>
                            {project.isResolved && (
                              <div className="my-project-resolved-tag-wrapper">
                                <ResolvedTag visible={true} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="my-project-description">
                      <h3 className="my-project-name">{project.name}</h3>
                      {project.subtitle && <p className="my-project-subtitle">{project.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* My Feedback Section */}
      <div className="my-feedback-section">
        <div className="my-feedback-header">
          <div className="my-feedback-header-left">
            <h2 className="my-feedback-title">My Feedback</h2>
            <div className="platform-filters">
              <button
                onClick={() => setMyFeedbackPlatform('apps')}
                className={`platform-filter ${myFeedbackPlatform === 'apps' ? 'active' : ''}`}
              >
                Apps
              </button>
              <button
                onClick={() => setMyFeedbackPlatform('web')}
                className={`platform-filter ${myFeedbackPlatform === 'web' ? 'active' : ''}`}
              >
                Webs
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Projects Grid */}
        <div className="my-feedback-grid">
          {myFeedbackPlatform === 'web' ? (
            // Web: 1행 × 3열
            <div className="my-feedback-row my-feedback-row-web">
              {feedbackProjects.map((project) => (
                <div
                  key={project.id}
                  className="my-feedback-item my-feedback-item-web"
                  onClick={() => navigate(`/projects/${project.id}/web`)}
                >
                  <div className="my-feedback-card my-feedback-card-web">
                    <div className="my-feedback-image-wrapper my-feedback-image-wrapper-web">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.name} className="my-feedback-image" />
                      ) : (
                        <div className="my-feedback-placeholder"></div>
                      )}
                    </div>
                  </div>
                  <div className="my-feedback-description">
                    <h3 className="my-feedback-name">{project.name}</h3>
                    {project.subtitle && <p className="my-feedback-subtitle">{project.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Apps: 1행 × 4열
            <div className="my-feedback-row my-feedback-row-apps">
              {feedbackProjects.map((project) => (
                <div
                  key={project.id}
                  className="my-feedback-item my-feedback-item-apps"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="my-feedback-card my-feedback-card-apps">
                    <div className="my-feedback-image-wrapper my-feedback-image-wrapper-apps">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.name} className="my-feedback-image" />
                      ) : (
                        <div className="my-feedback-placeholder"></div>
                      )}
                    </div>
                  </div>
                  <div className="my-feedback-description">
                    <h3 className="my-feedback-name">{project.name}</h3>
                    {project.subtitle && <p className="my-feedback-subtitle">{project.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
