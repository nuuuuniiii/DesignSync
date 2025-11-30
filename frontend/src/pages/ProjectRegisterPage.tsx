import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import { Textarea } from '@/components/Textarea/Textarea'
import { Select } from '@/components/Select/Select'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { RadioGroup } from '@/components/RadioGroup/RadioGroup'
import { ImageUpload } from '@/components/ImageUpload/ImageUpload'

const categories = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'web', label: 'Web' },
  { value: 'design', label: 'Design' },
]

const feedbackTypes = [
  { id: 'usability', label: 'Usability' },
  { id: 'visual', label: 'Visual Design' },
  { id: 'interaction', label: 'Interaction' },
  { id: 'content', label: 'Content' },
  { id: 'accessibility', label: 'Accessibility' },
]

const feedbackNameOptions = [
  { value: 'overall', label: 'Overall Feedback' },
  { value: 'first-impression', label: 'First Impression' },
  { value: 'navigation', label: 'Navigation' },
]

export const ProjectRegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    platform: 'web',
    category: '',
    feedbackTypes: [] as string[],
    feedbackName: '',
    customFeedbackName: '',
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 호출로 프로젝트 등록
    console.log('Project data:', { ...formData, images: uploadedImages })
    navigate('/explore')
  }

  const handleFeedbackTypeChange = (typeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      feedbackTypes: checked
        ? [...prev.feedbackTypes, typeId]
        : prev.feedbackTypes.filter((id) => id !== typeId),
    }))
  }

  const handleImagesChange = (files: File[]) => {
    setUploadedImages(files)
  }

  return (
    <Layout>
      <div className="project-register-page">
        <div className="page-header">
          <h1>Create New Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <Input
            id="project-name"
            label="프로젝트 이름"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            required
          />

          <Textarea
            id="description"
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
          />

          <RadioGroup
            name="platform"
            label="App/Web 여부"
            options={[
              { value: 'web', label: 'Web' },
              { value: 'app', label: 'App' },
            ]}
            value={formData.platform}
            onChange={(value) => setFormData({ ...formData, platform: value })}
          />

          <Select
            id="category"
            label="카테고리 선택"
            options={[{ value: '', label: '카테고리를 선택하세요' }, ...categories]}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />

          <div className="form-section">
            <label className="section-label">별점 평가 피드백 타입 선택</label>
            <div className="checkbox-group">
              {feedbackTypes.map((type) => (
                <Checkbox
                  key={type.id}
                  id={type.id}
                  label={type.label}
                  checked={formData.feedbackTypes.includes(type.id)}
                  onChange={(e) => handleFeedbackTypeChange(type.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">디자인 이미지 등록</label>
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxFiles={10}
            />
          </div>

          <div className="form-section">
            <label className="section-label">피드백 이름</label>
            <Select
              id="feedback-name"
              options={[{ value: '', label: '선택하거나 직접 입력' }, ...feedbackNameOptions]}
              value={formData.feedbackName}
              onChange={(e) => setFormData({ ...formData, feedbackName: e.target.value })}
            />
            <Input
              id="custom-feedback-name"
              placeholder="또는 직접 입력"
              value={formData.customFeedbackName}
              onChange={(e) =>
                setFormData({ ...formData, customFeedbackName: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              프로젝트 등록
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

