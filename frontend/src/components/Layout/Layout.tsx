import { ReactNode } from 'react'
import { GNB } from './GNB'

type PlatformType = 'web' | 'apps'

interface LayoutProps {
  children: ReactNode
  selectedPlatform?: PlatformType
  onPlatformChange?: (platform: PlatformType) => void
}

export const Layout = ({
  children,
  selectedPlatform,
  onPlatformChange,
}: LayoutProps) => {
  return (
    <div className="layout">
      <GNB selectedPlatform={selectedPlatform} onPlatformChange={onPlatformChange} />
      <main className="main-content">{children}</main>
    </div>
  )
}

