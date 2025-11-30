# 컴포넌트 구조

Figma 디자인 파일을 기반으로 생성된 컴포넌트들입니다.

## Figma 디자인 링크

- [전체 디자인](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-916&m=dev)
- [GNB 컴포넌트](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-7179&m=dev) ✅
- [ProjectsHeader 컴포넌트](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=22-6780&m=dev) ✅

## 컴포넌트 목록

### Layout 컴포넌트
- `GNB` - Global Navigation Bar
  - DesignSync 로고 (Revalia 폰트, 녹색)
  - Webs/Apps/My Page 네비게이션
  - 검색 바 (중앙)
  - Sign up / Sign In 버튼 (오른쪽)
  - [Figma 디자인](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=2-7179&m=dev)
- `Layout` - 전체 레이아웃 래퍼

### Project 관련
- `ProjectCard` - 프로젝트 카드 컴포넌트
- `ProjectsHeader` - 프로젝트 헤더 컴포넌트
  - 제목 (기본: "My Project")
  - 플랫폼 필터 (Apps/Webs)
  - 상태 필터 (Unresolved/Resolved, 선택적)
  - "Add New Project" 버튼
  - [Figma 디자인](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=22-6780&m=dev)

### Filter 컴포넌트
- `FilterBar` - 카테고리 및 상태 필터
- `Category` - 카테고리 사이드바 컴포넌트

### Form 컴포넌트
- `Button` - 버튼 컴포넌트
- `Input` - 텍스트 입력 필드
- `Textarea` - 여러 줄 텍스트 입력
- `Select` - 드롭다운 선택

### 특수 컴포넌트
- `RatingSlider` - 별점 슬라이더 (1-5점)
- `ImageUpload` - 이미지 업로드 (드래그 앤 드롭 지원)

## 사용 예시

```tsx
import { Layout, GNB, ProjectCard, Button, Input } from '@/components'

function App() {
  return (
    <Layout>
      <ProjectCard
        id="1"
        name="프로젝트 이름"
        category="카테고리"
        status="unsolved"
        hasNewFeedback={true}
      />
    </Layout>
  )
}
```

## 향후 추가 예정

다음 컴포넌트들을 추가로 개발할 예정입니다:
- Checkbox (피드백 타입 선택용)
- RadioButton (App/Web 선택용)
- Modal
- Card
- 등등...

