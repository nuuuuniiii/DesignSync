import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { SearchIcon } from '@/components/Icon/SearchIcon'

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
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    // TODO: 검색 기능 구현
    console.log('Search:', query)
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
              onClick={() => onPlatformChange?.('web')}
              className={`nav-link ${selectedPlatform === 'web' ? 'active' : ''}`}
            >
              Webs
            </button>
            <button
              onClick={() => onPlatformChange?.('apps')}
              className={`nav-link ${selectedPlatform === 'apps' ? 'active' : ''}`}
            >
              Apps
            </button>
            <Link
              to="/my-page"
              className={`nav-link ${location.pathname === '/my-page' ? 'active' : ''}`}
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

      {/* 오른쪽: 인증 버튼 */}
      <div className="gnb-right">
        <button className="btn-signup">Sign up</button>
        <button className="btn-signin">Sign In</button>
      </div>
    </nav>
  )
}
