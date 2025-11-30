import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import { Button } from '@/components/Button/Button'

interface Project {
  id: string
  name: string
  category: string
  status: 'solved' | 'unsolved'
  hasNewFeedback: boolean
}

interface FeedbackProject {
  id: string
  name: string
  category: string
  feedbackSummary: string
}

export const MyPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<'projects' | 'feedback'>('projects')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Mock 데이터 (추후 API 연동)
  const myProjects: Project[] = [
    {
      id: '1',
      name: 'Shopping App Redesign',
      category: 'ecommerce',
      status: 'unsolved',
      hasNewFeedback: true,
    },
    {
      id: '2',
      name: 'Web Dashboard',
      category: 'dashboard',
      status: 'solved',
      hasNewFeedback: false,
    },
  ]

  const feedbackProjects: FeedbackProject[] = [
    {
      id: '1',
      name: 'Shopping App Redesign',
      category: 'ecommerce',
      feedbackSummary: '구매 버튼 위치 관련 피드백 3건',
    },
  ]

  const handleProjectSelect = (projectId: string) => {
    if (!selectMode) return

    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleResolved = () => {
    // TODO: API 호출
    console.log('Resolved projects:', selectedProjects)
    setSelectedProjects([])
    setSelectMode(false)
  }

  const handleEdit = (projectId: string) => {
    navigate(`/projects/${projectId}/edit`)
  }

  const handleDelete = () => {
    // TODO: API 호출 및 확인 모달
    console.log('Delete projects:', selectedProjects)
    setSelectedProjects([])
    setSelectMode(false)
  }

  return (
    <Layout>
      <div className="my-page">
        <div className="page-header">
          <h1>My Page</h1>
        </div>

        <div className="tabs">
          <button
            className={selectedTab === 'projects' ? 'active' : ''}
            onClick={() => setSelectedTab('projects')}
          >
            My Project
          </button>
          <button
            className={selectedTab === 'feedback' ? 'active' : ''}
            onClick={() => setSelectedTab('feedback')}
          >
            My Feedback
          </button>
        </div>

        {selectedTab === 'projects' && (
          <div className="my-projects-section">
            <div className="section-header">
              <h2>내 프로젝트</h2>
              <div className="actions">
                {!selectMode ? (
                  <Button onClick={() => setSelectMode(true)}>Select</Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => setSelectMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleResolved}>
                      Resolved
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => selectedProjects.length === 1 && handleEdit(selectedProjects[0])}
                      disabled={selectedProjects.length !== 1}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="projects-list">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProjects.includes(project.id) ? 'selected' : ''}`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <ProjectCard
                    id={project.id}
                    name={project.name}
                    category={project.category}
                    status={project.status}
                    hasNewFeedback={project.hasNewFeedback}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'feedback' && (
          <div className="my-feedback-section">
            <h2>내가 피드백을 남긴 프로젝트</h2>
            <div className="feedback-projects-list">
              {feedbackProjects.map((project) => (
                <div
                  key={project.id}
                  className="feedback-project-item"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <h3>{project.name}</h3>
                  <p className="category">{project.category}</p>
                  <p className="feedback-summary">{project.feedbackSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

