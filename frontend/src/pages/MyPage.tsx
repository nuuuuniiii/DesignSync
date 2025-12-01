import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/Button/Button'
import { CommentIcon } from '@/components/Icon/CommentIcon'
import { ResolvedTag } from '@/components/ResolvedTag/ResolvedTag'

type PlatformType = 'apps' | 'webs'

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
 * Select 모드 (Apps): https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-5302&m=dev
 * Apps 버전: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-5024&m=dev
 *
 * 구성 요소:
 * - My Project 섹션: 내가 등록한 프로젝트 목록, Select 모드 지원
 * - My Feedback 섹션: 내가 피드백을 남긴 프로젝트 목록
 */
export const MyPage = () => {
  const navigate = useNavigate()
  const [platform, setPlatform] = useState<PlatformType>('apps') // Apps 버전 기본값
  const [selectMode, setSelectMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Mock 데이터 - My Project (Web: 6개, Apps: 8개)
  const myProjects: Project[] = Array.from({ length: platform === 'webs' ? 6 : 8 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    hasNewFeedback: platform === 'apps' ? i < 4 : i < 3, // Apps는 처음 4개, Web은 처음 3개
    isResolved: i === 0, // 첫 번째 카드만 Resolved 상태
  }))

  // Mock 데이터 - My Feedback (Apps: 4개)
  const feedbackProjects: Project[] = Array.from({ length: platform === 'apps' ? 4 : 3 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
  }))

  const handleSelectMode = () => {
    setSelectMode(true)
    // Select 모드 진입 시 모든 프로젝트를 자동 선택
    const allProjectIds = myProjects.map((p) => p.id)
    setSelectedProjects(allProjectIds)
  }

  const handleProjectClick = (projectId: string) => {
    if (selectMode) {
      handleProjectSelect(projectId)
    } else {
      navigate(`/projects/${projectId}`)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    if (!selectMode) return

    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  const handleResolved = () => {
    // TODO: API 호출
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
    // TODO: API 호출 및 확인 모달
    console.log('Delete projects:', selectedProjects)
    setSelectedProjects([])
    setSelectMode(false)
  }

  const handleAddProject = () => {
    navigate('/registration')
  }

  const handleCancelSelect = () => {
    setSelectMode(false)
    setSelectedProjects([])
  }

  return (
    <Layout>
      <div className={`my-page ${platform === 'webs' ? 'my-page-web' : 'my-page-apps'}`}>
        {/* My Project Section */}
        <div className="my-project-section">
          <div className={`my-project-header ${platform === 'webs' ? 'my-project-header-web' : 'my-project-header-app'}`}>
            <div className="my-project-header-left">
              <h2 className="my-project-title">My Project</h2>
              <div className="platform-filters">
                <button
                  onClick={() => setPlatform('apps')}
                  className={`platform-filter ${platform === 'apps' ? 'active' : ''}`}
                >
                  Apps
                </button>
                <button
                  onClick={() => setPlatform('webs')}
                  className={`platform-filter ${platform === 'webs' ? 'active' : ''}`}
                >
                  Webs
                </button>
              </div>
            </div>
            <div className={`my-project-header-right ${platform === 'webs' ? 'my-project-header-right-web' : ''}`}>
              {!selectMode ? (
                <>
                  <Button
                    onClick={handleSelectMode}
                    variant="secondary"
                    className="btn-select"
                  >
                    Select
                  </Button>
                  <Button onClick={handleAddProject} variant="primary" className="btn-add-project">
                    <span className="plus-icon">+</span>
                    Add New Project
                  </Button>
                </>
              ) : (
                <div className="select-mode-buttons">
                  <Button
                    onClick={handleResolved}
                    variant="primary"
                    className="btn-resolved"
                    disabled={selectedProjects.length === 0}
                  >
                    Resolved
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    className="btn-edit"
                    disabled={selectedProjects.length !== 1}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    className="btn-delete"
                    disabled={selectedProjects.length === 0}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="my-project-grid">
            {platform === 'webs' ? (
              // Web 버전: 2행 × 3열
              Array.from({ length: Math.ceil(myProjects.length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="my-project-row my-project-row-web">
                  {myProjects.slice(rowIndex * 3, rowIndex * 3 + 3).map((project) => (
                    <div
                      key={project.id}
                      className={`my-project-item my-project-item-web ${
                        selectedProjects.includes(project.id) ? 'selected' : ''
                      }`}
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
                            <div className="my-project-feedback-icon-area">
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
                            project.hasNewFeedback && (
                              <div className="my-project-feedback-icon my-project-feedback-icon-web">
                                <CommentIcon hasNewFeedback={true} width={32} height={32} />
                              </div>
                            )
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
              // Apps 버전: 2행 × 4열
              Array.from({ length: Math.ceil(myProjects.length / 4) }, (_, rowIndex) => (
                <div key={rowIndex} className="my-project-row my-project-row-apps">
                  {myProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                    <div
                      key={project.id}
                      className={`my-project-item my-project-item-apps ${
                        selectedProjects.includes(project.id) ? 'selected' : ''
                      }`}
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
                            <div className="my-project-feedback-icon-area">
                              <div
                                className={`my-project-resolved-tag-wrapper ${
                                  project.id === '1' ? '' : 'resolved-tag-hidden'
                                }`}
                              >
                                <ResolvedTag visible={true} />
                              </div>
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
                            project.hasNewFeedback && (
                              <div className="my-project-feedback-icon my-project-feedback-icon-apps">
                                <CommentIcon hasNewFeedback={true} width={32} height={32} />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="my-project-description my-project-description-apps">
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
            <h2 className="my-feedback-title">My Feedback</h2>
            <div className="platform-filters">
              <button
                onClick={() => setPlatform('apps')}
                className={`platform-filter ${platform === 'apps' ? 'active' : ''}`}
              >
                Apps
              </button>
              <button
                onClick={() => setPlatform('webs')}
                className={`platform-filter ${platform === 'webs' ? 'active' : ''}`}
              >
                Webs
              </button>
            </div>
          </div>
          <div className="my-feedback-grid">
            {platform === 'webs' ? (
              // Web 버전: 1행 × 3열
              <div className="my-feedback-row my-feedback-row-web">
                {feedbackProjects.map((project) => (
                  <div
                    key={project.id}
                    className="my-feedback-item my-feedback-item-web"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="my-feedback-card my-feedback-card-web">
                      <div className="my-feedback-image-wrapper my-feedback-image-wrapper-web">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.name}
                            className="my-feedback-image"
                          />
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
              // Apps 버전: 1행 × 4열
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
                          <img
                            src={project.imageUrl}
                            alt={project.name}
                            className="my-feedback-image"
                          />
                        ) : (
                          <div className="my-feedback-placeholder"></div>
                        )}
                      </div>
                    </div>
                    <div className="my-feedback-description my-feedback-description-apps">
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
    </Layout>
  )
}
