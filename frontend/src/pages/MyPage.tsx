import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [myProjectPlatform, setMyProjectPlatform] = useState<PlatformType>('apps')
  const [myFeedbackPlatform, setMyFeedbackPlatform] = useState<PlatformType>('apps')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Mock 데이터 - My Project
  const myProjects: Project[] = Array.from({ length: myProjectPlatform === 'web' ? 6 : 8 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    hasNewFeedback: i < (myProjectPlatform === 'apps' ? 4 : 3),
    isResolved: i === 0,
  }))

  // Mock 데이터 - My Feedback
  const feedbackProjects: Project[] = Array.from({ length: myFeedbackPlatform === 'apps' ? 4 : 3 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    hasNewFeedback: false, // My Feedback은 피드백이 없는 상태로 표시
    isResolved: i < 2, // 처음 2개만 Resolved 상태
  }))

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

  const handleDelete = () => {
    console.log('Delete projects:', selectedProjects)
    setSelectedProjects([])
    setSelectMode(false)
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
          {myProjectPlatform === 'web' ? (
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
