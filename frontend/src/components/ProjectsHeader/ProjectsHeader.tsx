import { Button } from '@/components/Button/Button'

/**
 * ProjectsHeader 컴포넌트
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=22-6780&m=dev
 * 
 * My project Header>web 컴포넌트
 */

type PlatformType = 'apps' | 'web'

interface ProjectsHeaderProps {
  title?: string
  showPlatformFilter?: boolean
  selectedPlatform?: PlatformType
  onPlatformChange?: (platform: PlatformType) => void
  showStatusFilter?: boolean
  selectedStatus?: 'unresolved' | 'resolved'
  onStatusChange?: (status: 'unresolved' | 'resolved') => void
  onAddProject?: () => void
}

export const ProjectsHeader = ({
  title = 'My Project',
  showPlatformFilter = true,
  selectedPlatform = 'apps',
  onPlatformChange,
  showStatusFilter = false,
  selectedStatus = 'unresolved',
  onStatusChange,
  onAddProject,
}: ProjectsHeaderProps) => {
  return (
    <div className="projects-header-container">
      <div className="projects-header-left">
        <h2 className="projects-header-title">{title}</h2>
        {showPlatformFilter && (
          <div className="platform-filters">
            <button
              onClick={() => onPlatformChange?.('apps')}
              className={`platform-filter ${
                selectedPlatform === 'apps' ? 'active' : ''
              }`}
            >
              Apps
            </button>
            <button
              onClick={() => onPlatformChange?.('web')}
              className={`platform-filter ${
                selectedPlatform === 'web' ? 'active' : ''
              }`}
            >
              Webs
            </button>
          </div>
        )}
        {showStatusFilter && (
          <div className="status-filters">
            <button
              onClick={() => onStatusChange?.('unresolved')}
              className={`status-filter ${
                selectedStatus === 'unresolved' ? 'active' : ''
              }`}
            >
              Unresolved
            </button>
            <button
              onClick={() => onStatusChange?.('resolved')}
              className={`status-filter ${
                selectedStatus === 'resolved' ? 'active' : ''
              }`}
            >
              Resolved
            </button>
          </div>
        )}
      </div>
      <div className="projects-header-right">
        <Button onClick={onAddProject} variant="primary" className="btn-add-project">
          <span className="plus-icon">+</span>
          Add New Project
        </Button>
      </div>
    </div>
  )
}

