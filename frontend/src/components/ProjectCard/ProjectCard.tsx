interface ProjectCardProps {
  id: string
  name: string
  category: string
  status: 'solved' | 'unsolved' | 'resolved' | 'unresolved'
  subtitle?: string
  description?: string
  imageUrl?: string
  hasNewFeedback?: boolean
  onClick?: () => void
}

export const ProjectCard = ({
  id,
  name,
  category,
  status,
  subtitle,
  description,
  imageUrl,
  hasNewFeedback = false,
  onClick,
}: ProjectCardProps) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <div className="project-card-placeholder">
            {/* 체크무늬 플레이스홀더 */}
          </div>
        )}
      </div>
      <div className="project-card-content">
        <h3 className="project-card-title">{name}</h3>
        {subtitle && <p className="project-card-subtitle">{subtitle}</p>}
        {description && <p className="project-card-description">{description}</p>}
      </div>
      {hasNewFeedback && <span className="comment-icon">💬</span>}
    </div>
  )
}

