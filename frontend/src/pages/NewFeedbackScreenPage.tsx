import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Select } from '@/components/Select/Select'
import { Textarea } from '@/components/Textarea/Textarea'
import { Button } from '@/components/Button/Button'

interface Design {
  id: string
  name: string
}

interface Screen {
  id: string
  name: string
  designId: string
}

interface Question {
  id: string
  content: string
  screenId: string
}

export const NewFeedbackScreenPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const ratings = location.state?.ratings || {}

  const [selectedDesign, setSelectedDesign] = useState<string>('')
  const [selectedScreen, setSelectedScreen] = useState<string>('')
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Mock 데이터 (추후 API 연동)
  const designs: Design[] = [
    { id: '1', name: 'Design A' },
    { id: '2', name: 'Design B' },
  ]

  const screens: Screen[] = [
    { id: '1', name: 'Product Detail', designId: '1' },
    { id: '2', name: 'Cart', designId: '1' },
    { id: '3', name: 'Checkout', designId: '2' },
  ]

  const questions: Question[] = [
    { id: '1', content: '이 화면에서 구매 버튼의 위치는 적절한가요?', screenId: '1' },
    { id: '2', content: '화면의 정보 구조가 명확한가요?', screenId: '1' },
  ]

  const availableScreens = screens.filter((screen) => screen.designId === selectedDesign)
  const availableQuestions = questions.filter((question) => question.screenId === selectedScreen)

  const handleSubmit = () => {
    // TODO: API로 피드백 제출
    console.log('Feedback submission:', {
      projectId,
      ratings,
      designId: selectedDesign,
      screenId: selectedScreen,
      answers,
    })
    navigate(`/projects/${projectId}`)
  }

  const handleCancel = () => {
    navigate(`/projects/${projectId}/feedback/rating`)
  }

  return (
    <Layout>
      <div className="new-feedback-screen-page">
        <div className="page-header">
          <h1>New Feedback - Screen</h1>
        </div>

        <div className="feedback-form">
          <Select
            id="design"
            label="Design 선택"
            options={[
              { value: '', label: 'Design을 선택하세요' },
              ...designs.map((d) => ({ value: d.id, label: d.name })),
            ]}
            value={selectedDesign}
            onChange={(e) => {
              setSelectedDesign(e.target.value)
              setSelectedScreen('')
            }}
            required
          />

          {selectedDesign && (
            <Select
              id="screen"
              label="Screen 선택"
              options={[
                { value: '', label: 'Screen을 선택하세요' },
                ...availableScreens.map((s) => ({ value: s.id, label: s.name })),
              ]}
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
              required
            />
          )}

          {selectedScreen && (
            <div className="questions-section">
              <h3>피드백 질문</h3>
              {availableQuestions.map((question) => (
                <Textarea
                  key={question.id}
                  id={`question-${question.id}`}
                  label={question.content}
                  value={answers[question.id] || ''}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [question.id]: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="피드백을 입력하세요..."
                />
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={handleCancel}>
            이전
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedDesign || !selectedScreen}
          >
            제출
          </Button>
        </div>
      </div>
    </Layout>
  )
}

