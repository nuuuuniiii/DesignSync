import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SearchIcon } from '@/components/Icon/SearchIcon'
import { ProfileIcon } from '@/components/Icon/ProfileIcon'
import { useAuth } from '@/contexts/AuthContext'

type PlatformType = 'web' | 'apps'

interface GNBProps {
  selectedPlatform?: PlatformType
  onPlatformChange?: (platform: PlatformType) => void
}

/**
 * GNB (Global Navigation Bar) 컴포넌트
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=22-6025&m=dev
 * 
 * 구성 요소:
 * - 왼쪽: DesignSync 로고, Webs/Apps/My Page 네비게이션
 * - 중앙: 검색 바
 * - 오른쪽: Sign up, Sign In 버튼
 */
export const GNB = ({ selectedPlatform = 'web', onPlatformChange }: GNBProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, logout } = useAuth()

  const handleSearch = (query: string) => {
    // TODO: 검색 기능 구현
    console.log('Search:', query)
  }

  const handleLogout = () => {
    logout()
    navigate('/explore')
  }

  const handlePlatformClick = (platform: PlatformType) => {
    if (location.pathname === '/my-page' || location.pathname.startsWith('/projects/') || location.pathname.startsWith('/my-projects/') || location.pathname === '/registration') {
      // My Page, Project Detail, My Project Detail, 또는 Registration에서 Apps/Webs 클릭 시 Explore 페이지로 이동
      navigate('/explore', { state: { platform } })
    } else {
      // 다른 페이지에서는 기존 동작 유지
      onPlatformChange?.(platform)
    }
  }

  return (
    <nav className="gnb">
      {/* 왼쪽: 로고 + 네비게이션 + 검색 바 */}
      <div className="gnb-left-group">
        <div className="logo-nav-group">
          <Link to="/explore" className="logo">
            DesignSync
          </Link>
          <div className="gnb-nav-links">
            <button
              onClick={() => handlePlatformClick('web')}
              className={`nav-link ${location.pathname === '/my-page' || location.pathname.startsWith('/my-projects/') || location.pathname === '/registration' ? '' : selectedPlatform === 'web' ? 'active' : ''}`}
            >
              Webs
            </button>
            <button
              onClick={() => handlePlatformClick('apps')}
              className={`nav-link ${location.pathname === '/my-page' || location.pathname.startsWith('/my-projects/') || location.pathname === '/registration' ? '' : selectedPlatform === 'apps' ? 'active' : ''}`}
            >
              Apps
            </button>
            <Link
              to="/my-page"
              className={`nav-link ${location.pathname === '/my-page' || location.pathname.startsWith('/my-projects/') || location.pathname === '/registration' ? 'active' : ''}`}
            >
              My Page
            </Link>
          </div>
        </div>
        {/* 중앙: 검색 바 */}
        <div className="search-bar">
          <span className="search-icon">
            <SearchIcon width={40} height={40} />
          </span>
          <input
            type="text"
            placeholder="Search sites"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            className="search-input"
          />
        </div>
      </div>

      {/* 오른쪽: 인증 버튼 또는 프로필 */}
      <div className="gnb-right">
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
            <Link to="/my-page" className="profile-link">
              <ProfileIcon width={40} height={40} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/sign-up" className="btn-signup">Sign up</Link>
            <Link to="/sign-in" className="btn-signin">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  )
}
