import './resolved-tag.css'

interface ResolvedTagProps {
  className?: string
  visible?: boolean
}

/**
 * Resolved 태그 컴포넌트
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-9159&m=dev
 */
export const ResolvedTag = ({ className = '', visible = true }: ResolvedTagProps) => {
  if (!visible) return null

  return (
    <div className={`resolved-tag ${className}`}>
      <span>Resolved</span>
    </div>
  )
}

