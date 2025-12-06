import React from 'react'

interface CommentIconProps {
  className?: string
  width?: number
  height?: number
  hasNewFeedback?: boolean
}

/**
 * 코멘트 아이콘 컴포넌트
 * 새 피드백이 있으면 초록색 배경으로 표시됨
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-1301&m=dev
 */
export const CommentIcon: React.FC<CommentIconProps> = ({
  className = '',
  width = 32,
  height: _height = 32,
  hasNewFeedback = false,
}) => {
  // off 상태일 때는 작은 아이콘만 표시 (배경 없음, 17px)
  if (!hasNewFeedback) {
    const iconSize = width < 20 ? width : 17
    return (
      <div className={`comment-icon-wrapper comment-icon-off ${className}`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
            fill="#000000"
          />
        </svg>
      </div>
    )
  }

  // on 상태일 때는 녹색 배경 원형 아이콘 (32px, 중앙에 20px 아이콘)
  const containerSize = width
  const iconSize = 20
  
  return (
    <div className={`comment-icon-wrapper comment-icon-on ${className}`}>
      <div
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          backgroundColor: '#B4FD2C',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>
  )
}
