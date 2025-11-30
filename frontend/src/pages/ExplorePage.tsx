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
  const projects: Project[] = Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
    name: 'T map',
    subtitle: 'UX/UI Flow Redesign',
    category: 'Technology',
    status: 'unresolved' as const,
  }))

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory && project.category !== selectedCategory) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    return true
  })

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  const handleAddProject = () => {
    navigate('/projects/new')
  }

  return (
    <Layout selectedPlatform={platform} onPlatformChange={setPlatform}>
      <div className="explore-page">
        <div className="explore-container">
          {/* Categories 섹션 */}
          <Category
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* 오른쪽: Projects 섹션 */}
          <main className="projects-main">
            <div className="projects-header">
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
              <div className="projects-header-right">
                <Button onClick={handleAddProject} variant="primary" className="btn-add-project">
                  <span className="plus-icon">+</span>
                  Add New Project
                </Button>
              </div>
            </div>

            <div className="projects-sections">
              {/* 프로젝트를 3개씩 그룹화하여 행으로 나누기 */}
              {Array.from({ length: Math.ceil(filteredProjects.length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="projects-row">
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
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

