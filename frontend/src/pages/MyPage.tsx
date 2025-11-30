import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/Button/Button'
import { CommentIcon } from '@/components/Icon/CommentIcon'

type PlatformType = 'apps' | 'webs'

interface Project {
  id: string
  name: string
  subtitle?: string
  imageUrl?: string
  hasNewFeedback?: boolean
}

/**
 * My Page 화면
 *
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-5024&m=dev
 *
 * 구성 요소:
 * - My Project 섹션: 내가 등록한 프로젝트 목록, Select 모드 지원
 * - My Feedback 섹션: 내가 피드백을 남긴 프로젝트 목록
 */
export const MyPage = () => {
  const navigate = useNavigate()
  const [platform, setPlatform] = useState<PlatformType>('apps')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Mock 데이터 - My Project
  const myProjects: Project[] = Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    hasNewFeedback: i < 4, // 처음 4개는 새 피드백 있음
  }))

  // Mock 데이터 - My Feedback
  const feedbackProjects: Project[] = Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
  }))

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
    navigate('/projects/new')
  }

  return (
    <Layout>
      <div className="my-page">
        {/* My Project Section */}
        <div className="my-project-section">
          <div className="my-project-header">
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
            <div className="my-project-header-right">
              {!selectMode ? (
                <>
                  <Button
                    onClick={() => setSelectMode(true)}
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
                <>
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
                </>
              )}
            </div>
          </div>
          <div className="my-project-grid">
            {Array.from({ length: Math.ceil(myProjects.length / 4) }, (_, rowIndex) => (
              <div key={rowIndex} className="my-project-row">
                {myProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                  <div
                    key={project.id}
                    className={`my-project-item ${
                      selectedProjects.includes(project.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="my-project-card">
                      <div className="my-project-image-wrapper">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={project.name} className="my-project-image" />
                        ) : (
                          <div className="my-project-placeholder"></div>
                        )}
                      </div>
                      {project.hasNewFeedback && (
                        <div className="my-project-feedback-icon">
                          <CommentIcon hasNewFeedback={true} width={32} height={32} />
                        </div>
                      )}
                    </div>
                    <div className="my-project-description">
                      <h3 className="my-project-name">{project.name}</h3>
                      {project.subtitle && <p className="my-project-subtitle">{project.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
            {Array.from({ length: Math.ceil(feedbackProjects.length / 4) }, (_, rowIndex) => (
              <div key={rowIndex} className="my-feedback-row">
                {feedbackProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                  <div
                    key={project.id}
                    className="my-feedback-item"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="my-feedback-card">
                      <div className="my-feedback-image-wrapper">
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
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
