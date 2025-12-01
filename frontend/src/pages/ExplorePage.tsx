import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import { Button } from '@/components/Button/Button'
import { Category } from '@/components/Category/Category'

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

/**
 * Explore 페이지
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-2684&m=dev
 * 
 * GNB 컴포넌트: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-7179&m=dev
 */
export const ExplorePage = () => {
  const navigate = useNavigate()
  const [platform, setPlatform] = useState<PlatformType>('web')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('unresolved')

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

  // Mock 데이터 (이미지의 프로젝트 카드 예시)
  // Apps 버전: 8개 이상 필요 (2행 × 4개)
  const projects: Project[] = Array.from({ length: platform === 'apps' ? 8 : 9 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    category: 'Technology',
    // 처음 4개는 unresolved, 나머지는 resolved
    status: (i < 4 ? 'unresolved' : 'resolved') as const,
  }))

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory && project.category !== selectedCategory) return false
    // Apps 버전과 Web 버전 모두 status 필터 적용
    if (project.status !== selectedStatus) return false
    return true
  })

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`)
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
                  <h2 className="my-project-title">My Project</h2>
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
              {/* 플랫폼에 따라 다른 개수로 그룹화 */}
              {platform === 'apps' ? (
                // Apps: 4개씩 그룹화 (Others app 섹션)
                Array.from({ length: Math.ceil(filteredProjects.length / 4) }, (_, rowIndex) => (
                  <div key={rowIndex} className="others-app-section">
                    {filteredProjects.slice(rowIndex * 4, rowIndex * 4 + 4).map((project) => (
                      <div
                        key={project.id}
                        className="app-project-item"
                        onClick={() => handleProjectClick(project.id)}
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

