# DesignSync 폰트 가이드

## 사용 폰트

### 1. Pretendard (1.3.9)
- **용도**: 기본 본문 및 UI 텍스트
- **CSS 변수**: `var(--font-pretendard)`
- **다운로드**: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
- **CDN**: https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/

### 2. Revalia
- **용도**: 로고, 제목, 특별한 강조 텍스트
- **CSS 변수**: `var(--font-revalia)`
- **다운로드**: https://fonts.google.com/specimen/Revalia

## 폰트 파일 위치

폰트 파일은 `frontend/public/fonts/` 디렉토리에 저장합니다.

## 설치 방법

### 방법 1: 로컬 파일 사용 (권장)

1. Pretendard 폰트 파일 다운로드
   - GitHub에서 다운로드: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
   - 필요한 파일들을 `frontend/public/fonts/` 디렉토리에 복사

2. Revalia 폰트 파일 다운로드
   - Google Fonts에서 다운로드
   - `Revalia-Regular.woff2` 또는 `.woff` 파일을 `frontend/public/fonts/` 디렉토리에 복사

### 방법 2: CDN 사용 (빠른 테스트용)

`frontend/index.html`에 다음을 추가:

```html
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Revalia&display=swap" rel="stylesheet">
```

그리고 `src/styles/fonts.css` 파일을 수정하여 CDN 폰트를 사용하도록 설정

## 사용 예시

### CSS에서 사용
```css
/* Pretendard 사용 */
body {
  font-family: var(--font-pretendard);
}

/* Revalia 사용 */
.logo {
  font-family: var(--font-revalia);
}
```

### React 컴포넌트에서 사용
```tsx
<div style={{ fontFamily: 'var(--font-revalia)' }}>
  DesignSync
</div>

<p style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
  본문 텍스트
</p>
```

### 클래스명으로 사용
```tsx
<h1 className="font-revalia">제목</h1>
<p className="font-pretendard font-medium">본문</p>
```

## 폰트 파일 구조

```
frontend/
├── public/
│   └── fonts/
│       ├── Pretendard-Thin.woff2
│       ├── Pretendard-Regular.woff2
│       ├── Pretendard-Bold.woff2
│       ├── ... (기타 Pretendard 파일들)
│       └── Revalia-Regular.woff2
└── src/
    └── styles/
        ├── fonts.css          # 폰트 정의
        └── typography.css     # 타이포그래피 스타일
```

## 참고

- 폰트 파일은 `.gitignore`에 추가하지 않았으므로, 프로젝트에 포함됩니다.
- 큰 파일 크기를 고려하여 필요한 폰트 웨이트만 포함하는 것을 권장합니다.
- 웹 성능을 위해 `font-display: swap`을 사용하여 폰트 로딩 중에도 텍스트가 표시되도록 설정했습니다.

