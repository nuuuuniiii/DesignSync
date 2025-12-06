import { useState, useRef, useEffect } from 'react'
import './feedback-item.css'

interface FeedbackItemProps {
  questionNumber: string
  question: string
  feedbacks: {
    id: string
    screenNumber: number
    author: string
    content: string
    isMyComment?: boolean
  }[]
  onMenuClick?: (action: 'delete' | 'edit' | 'report', feedbackId: string) => void
}

export const FeedbackItem = ({
  questionNumber,
  question,
  feedbacks,
  onMenuClick,
}: FeedbackItemProps) => {
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null)
  const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isMenuButton = (target as HTMLElement).closest('.menu-button')
      
      if (isMenuButton) {
        return
      }

      Object.entries(tooltipRefs.current).forEach(([_id, ref]) => {
        if (ref && !ref.contains(target)) {
          setOpenTooltipId(null)
        }
      })
    }

    if (openTooltipId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openTooltipId])

  const handleMenuClick = (feedbackId: string) => {
    setOpenTooltipId(openTooltipId === feedbackId ? null : feedbackId)
  }

  const handleTooltipAction = (action: 'delete' | 'edit' | 'report', feedbackId: string) => {
    setOpenTooltipId(null)
    onMenuClick?.(action, feedbackId)
  }

  return (
    <div className="feedback-item">
      <div className="feedback-question-header">
        <div className="question-content">
          <div className="question-badge">Q{questionNumber}</div>
          <p className="question-text">{question}</p>
        </div>
      </div>

      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="feedback-answer-wrapper">
          <div className="feedback-answer">
            <div className="feedback-answer-content">
              <div className="screen-number-wrapper">
                <div className="screen-number-badge">{feedback.screenNumber}</div>
              </div>
              <div className="feedback-text">
                <p className="feedback-author">{feedback.author}</p>
                <div className="feedback-content">
                  {feedback.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="feedback-menu-wrapper">
              <button
                className="menu-button"
                onClick={() => handleMenuClick(feedback.id)}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="8" r="2" fill="#000000" />
                  <circle cx="16" cy="16" r="2" fill="#000000" />
                  <circle cx="16" cy="24" r="2" fill="#000000" />
                </svg>
              </button>
              {openTooltipId === feedback.id && (
                <div
                  ref={(el) => (tooltipRefs.current[feedback.id] = el)}
                  className="tooltip-menu feedback-tooltip"
                >
                  {feedback.isMyComment ? (
                    <>
                      <button onClick={() => handleTooltipAction('delete', feedback.id)}>
                        삭제하기
                      </button>
                      <div className="tooltip-divider"></div>
                      <button onClick={() => handleTooltipAction('edit', feedback.id)}>
                        수정하기
                      </button>
                      <div className="tooltip-divider"></div>
                      <button onClick={() => handleTooltipAction('report', feedback.id)}>
                        신고하기
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleTooltipAction('report', feedback.id)}>
                      신고하기
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

