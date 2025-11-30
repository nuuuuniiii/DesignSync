# 폰트 파일 저장 위치

이 디렉토리에 Pretendard와 Revalia 폰트 파일을 저장하세요.

## 필요한 폰트 파일

### Pretendard (1.3.9 버전)
다음 폰트 파일들을 이 디렉토리에 저장하세요:
- Pretendard-Thin.woff2 (또는 .woff)
- Pretendard-ExtraLight.woff2 (또는 .woff)
- Pretendard-Light.woff2 (또는 .woff)
- Pretendard-Regular.woff2 (또는 .woff)
- Pretendard-Medium.woff2 (또는 .woff)
- Pretendard-SemiBold.woff2 (또는 .woff)
- Pretendard-Bold.woff2 (또는 .woff)
- Pretendard-ExtraBold.woff2 (또는 .woff)
- Pretendard-Black.woff2 (또는 .woff)

### Revalia
- Revalia-Regular.woff2 (또는 .woff)

## 다운로드 링크

### Pretendard
- GitHub: https://github.com/orioncactus/pretendard
- CDN: https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/

### Revalia
- Google Fonts: https://fonts.google.com/specimen/Revalia

## 사용 방법

폰트는 이미 `src/styles/fonts.css`에 등록되어 있고, `src/index.css`에서 import되고 있습니다.

CSS 변수로 사용 가능:
- `var(--font-pretendard)` - Pretendard 폰트
- `var(--font-revalia)` - Revalia 폰트

## 예시

```css
.title {
  font-family: var(--font-revalia);
}

.body {
  font-family: var(--font-pretendard);
}
```

