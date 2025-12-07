import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import { Button } from '@/components/Button/Button'
import { Category } from '@/components/Category/Category'
import { getProjects, Project as ApiProject } from '@/api/projects'

type PlatformType = 'web' | 'apps'
type ProjectStatus = 'unresolved' | 'resolved'

interface Project {
  id: string
  name: string
  category: string
  status: 'resolved' | 'unresolved'
  subtitle?: string
  imageUrl?: string
}

// API Project를 화면용 Project로 변환
const convertApiProjectToDisplayProject = (apiProject: ApiProject): Project => {
  return {
    id: apiProject.id,
    name: apiProject.name,
    category: apiProject.category,
    status: apiProject.status,
    subtitle: apiProject.description || undefined,
    imageUrl: apiProject.thumbnail_url || undefined,
  }
}

/**
 * Explore 페이지
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-2684&m=dev
 * 
 * GNB 컴포넌트: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-7179&m=dev
 */
export const ExplorePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [platform, setPlatform] = useState<PlatformType>('web')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('unresolved')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // My Page에서 넘어올 때 플랫폼 설정
  useEffect(() => {
    if (location.state?.platform) {
      setPlatform(location.state.platform)
    }
  }, [location.state])

  // Figma 디자인에 맞춘 카테고리 목록
  const categories = [
    'E-Commerce',
    'Media',
    'Social',
    'Entertainment',
    'Education',
    'Business',
    'Finance',
    'Government',
    'Wellness',
    'Travel',
    'Lifestyle',
    'Technology',
  ]

  // 프로젝트 목록 가져오기 함수
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const platformFilter = platform === 'apps' ? 'app' : 'web'
      const result = await getProjects({
        platform: platformFilter,
        status: selectedStatus,
        category: selectedCategory,
        // userId를 전달하지 않으면 모든 사용자의 프로젝트를 가져옵니다
      })

      if (result.success && result.data) {
        const convertedProjects = result.data.map(convertApiProjectToDisplayProject)
        setProjects(convertedProjects)
      } else {
        setError(result.error || '프로젝트 목록을 가져오는데 실패했습니다.')
        setProjects([])
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 목록을 가져오는 중 오류가 발생했습니다.'
      setError(errorMessage)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [platform, selectedStatus, selectedCategory])

  // 프로젝트 목록 가져오기
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // 플랫폼 변경 시 상태도 초기화 (선택사항)
  useEffect(() => {
    setSelectedCategory(undefined)
  }, [platform])

  const filteredProjects = projects

  const handleProjectClick = (projectId: string) => {
    // Apps 플랫폼일 때는 ProjectOverviewAppPage로 이동 (app=on)
    if (platform === 'apps') {
      navigate(`/projects/${projectId}`)
    } else {
      // Web 플랫폼일 때는 /web 경로로 이동하여 app=off로 표시
      navigate(`/projects/${projectId}/web`, { replace: false })
    }
  }

  const handleAddProject = () => {
    navigate('/registration')
  }

  return (
    <Layout selectedPlatform={platform} onPlatformChange={setPlatform}>
      <div className={`explore-page ${platform === 'apps' ? 'explore-page-apps' : 'explore-page-web'}`}>
        <div className="explore-container">
          {/* Categories 섹션 */}
          <Category
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Projects 섹션 */}
          <div className={`projects-content ${platform === 'apps' ? 'projects-content-apps' : 'projects-content-web'}`}>
            <main className="projects-main">
            {platform === 'apps' ? (
              <div className="my-project-header-app">
                <div className="my-project-header-app-left">
                  <h2 className="my-project-title">Projects</h2>
                  <div className="my-project-platform-filters">
                    <button
                      onClick={() => setSelectedStatus('unresolved')}
                      className={`my-project-platform-filter ${
                        selectedStatus === 'unresolved' ? 'active' : ''
                      }`}
                    >
                      Unresolved
                    </button>
                    <button
                      onClick={() => setSelectedStatus('resolved')}
                      className={`my-project-platform-filter ${
                        selectedStatus === 'resolved' ? 'active' : ''
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
                <div className="my-project-header-app-right">
                  <Button onClick={handleAddProject} variant="primary" className="btn-add-project">
                    <span className="plus-icon">+</span>
                    Add New Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="projects-header projects-header-web">
                <div className="projects-header-left">
                  <h2 className="projects-title">Projects</h2>
                  <div className="status-filters">
                    <button
                      onClick={() => setSelectedStatus('unresolved')}
                      className={`status-filter ${
                        selectedStatus === 'unresolved' ? 'active' : ''
                      }`}
                    >
                      Unresolved
                    </button>
                    <button
                      onClick={() => setSelectedStatus('resolved')}
                      className={`status-filter ${
                        selectedStatus === 'resolved' ? 'active' : ''
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
                <div className="projects-header-right projects-header-right-web">
                  <Button onClick={handleAddProject} variant="primary" className="btn-add-project">
                    <span className="plus-icon">+</span>
                    Add New Project
                  </Button>
                </div>
              </div>
            )}

            <div className={`projects-sections ${platform === 'apps' ? 'projects-sections-apps' : 'projects-sections-web'}`}>
              {isLoading ? (
                <div className="empty-state">
                  <p>프로젝트를 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <p>오류: {error}</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="empty-state">
                  <p>표시할 프로젝트가 없습니다.</p>
                </div>
              ) : platform === 'apps' ? (
                // Apps: 4개씩 그룹화 (Others app 섹션)
                Array.from({ length: Math.ceil(filteredProjects.length / 4) }, (_, rowIndex) => (
                  <div key={rowIndex} className="others-app-section">
                    {filteredProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                      <div
                        key={project.id}
                        className="app-project-item"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleProjectClick(project.id)
                        }}
                      >
                        <div className="app-project-card">
                          <div className="app-project-image-wrapper">
                            {project.imageUrl ? (
                              <img src={project.imageUrl} alt={project.name} className="app-project-image" />
                            ) : (
                              <div className="app-project-placeholder"></div>
                            )}
                          </div>
                        </div>
                        <div className="app-project-description">
                          <h3 className="app-project-title">{project.name}</h3>
                          {project.subtitle && <p className="app-project-subtitle">{project.subtitle}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                // Web: 3개씩 그룹화
                Array.from({ length: Math.ceil(filteredProjects.length / 3) }, (_, rowIndex) => (
                  <div key={rowIndex} className="projects-row projects-row-web">
                    {filteredProjects.slice(rowIndex * 3, rowIndex * 3 + 3).map((project) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        category={project.category}
                        status={project.status}
                        subtitle={project.subtitle}
                        imageUrl={project.imageUrl}
                        onClick={() => handleProjectClick(project.id)}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </main>
          </div>
        </div>
      </div>
    </Layout>
  )
}

