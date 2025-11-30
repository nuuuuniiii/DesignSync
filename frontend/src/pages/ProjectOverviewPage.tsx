import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { RatingSlider } from '@/components/RatingSlider/RatingSlider'
import { Button } from '@/components/Button/Button'

interface Design {
  id: string
  name: string
  screens: Screen[]
}

interface Screen {
  id: string
  name: string
  feedbackCount: number
  averageRating: number
}

export const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  // Mock 데이터 (추후 API 연동)
  const projectName = 'Shopping App Redesign'
  const averageRating = 4.2
  const designs: Design[] = [
    {
      id: '1',
      name: 'Design A',
      screens: [
        { id: '1', name: 'Product Detail', feedbackCount: 5, averageRating: 4.5 },
        { id: '2', name: 'Cart', feedbackCount: 3, averageRating: 4.0 },
      ],
    },
    {
      id: '2',
      name: 'Design B',
      screens: [
        { id: '3', name: 'Checkout', feedbackCount: 2, averageRating: 3.8 },
      ],
    },
  ]

  const handleNewFeedback = () => {
    navigate(`/projects/${projectId}/feedback/rating`)
  }

  const handleScreenClick = (screenId: string) => {
    // TODO: 화면별 피드백 상세 조회
    console.log('View feedbacks for screen:', screenId)
  }

  return (
    <Layout>
      <div className="project-overview-page">
        <div className="page-header">
          <h1>{projectName}</h1>
          <Button onClick={handleNewFeedback}>New Feedback</Button>
        </div>

        <div className="overview-section">
          <h2>Overall Rating</h2>
          <div className="average-rating">
            <RatingSlider value={Math.round(averageRating)} min={1} max={5} readOnly />
            <span className="rating-value">{averageRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="designs-section">
          <h2>Designs</h2>
          {designs.map((design) => (
            <div key={design.id} className="design-group">
              <h3 className="design-name">{design.name}</h3>
              <div className="screens-list">
                {design.screens.map((screen) => (
                  <div
                    key={screen.id}
                    className="screen-item"
                    onClick={() => handleScreenClick(screen.id)}
                  >
                    <div className="screen-header">
                      <h4>{screen.name}</h4>
                      <span className="feedback-count">{screen.feedbackCount} feedbacks</span>
                    </div>
                    <div className="screen-rating">
                      <span>평균 별점: {screen.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

