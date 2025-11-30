import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { RatingSlider } from '@/components/RatingSlider/RatingSlider'
import { Button } from '@/components/Button/Button'

export const NewFeedbackRatingPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // Mock 데이터 (추후 API 연동)
  const feedbackTypes = [
    { id: 'usability', label: 'Usability' },
    { id: 'visual', label: 'Visual Design' },
    { id: 'interaction', label: 'Interaction' },
    { id: 'content', label: 'Content' },
  ]

  const handleRatingChange = (typeId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [typeId]: value,
    }))
  }

  const handleNext = () => {
    // TODO: API로 별점 저장
    console.log('Ratings:', ratings)
    navigate(`/projects/${projectId}/feedback/screen`, { state: { ratings } })
  }

  const handleCancel = () => {
    navigate(`/projects/${projectId}`)
  }

  return (
    <Layout>
      <div className="new-feedback-rating-page">
        <div className="page-header">
          <h1>New Feedback - Rating</h1>
        </div>

        <div className="rating-section">
          <p className="instruction">각 항목에 대해 1-5점 사이의 별점을 주세요.</p>

          <div className="rating-list">
            {feedbackTypes.map((type) => (
              <div key={type.id} className="rating-item">
                <h3>{type.label}</h3>
                <RatingSlider
                  min={1}
                  max={5}
                  value={ratings[type.id] || 1}
                  onChange={(value) => handleRatingChange(type.id, value)}
                  label={type.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleNext}>
            다음
          </Button>
        </div>
      </div>
    </Layout>
  )
}

