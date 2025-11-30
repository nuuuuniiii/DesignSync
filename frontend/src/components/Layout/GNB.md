# GNB (Global Navigation Bar) 컴포넌트

## Figma 디자인

[DesignSync 응용디자인 - GNB](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-7179&m=dev)

## 컴포넌트 구조

GNB는 상단 고정 네비게이션 바로, 다음 3개 섹션으로 구성됩니다:

### 1. 왼쪽 섹션 (gnb-left)
- **DesignSync 로고**: Revalia 폰트, 녹색 (#4caf50)
- **네비게이션 링크**: Webs, Apps, My Page

### 2. 중앙 섹션 (gnb-center)
- **검색 바**: "Search sites" placeholder

### 3. 오른쪽 섹션 (gnb-right)
- **Sign up 버튼**: 검은색 배경
- **Sign In 버튼**: 회색 배경

## 사용 방법

```tsx
import { GNB } from '@/components/Layout/GNB'

function App() {
  const [platform, setPlatform] = useState<'web' | 'apps'>('web')
  
  return (
    <GNB 
      selectedPlatform={platform}
      onPlatformChange={setPlatform}
    />
  )
}
```

## Props

- `selectedPlatform`: 현재 선택된 플랫폼 ('web' | 'apps')
- `onPlatformChange`: 플랫폼 변경 시 호출되는 콜백

## 파일 위치

- 컴포넌트: `frontend/src/components/Layout/GNB.tsx`
- 스타일: `frontend/src/styles/gnb.css`

