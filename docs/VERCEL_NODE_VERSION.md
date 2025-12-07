# Vercel Node.js 버전 설정 가이드

## 문제
Vercel에서 Node.js 24.x 버전이 감지되어 오류 발생:
```
Error: Found invalid Node.js Version: "24.x". Please set Node.js Version to 22.x in your Project Settings to use Node.js 22.
```

## 해결 방법

### 방법 1: Vercel 대시보드에서 설정 (권장)

1. Vercel 대시보드 → **백엔드 프로젝트** (design-sync-iota) 선택
2. **Settings** → **General** 탭
3. **Node.js Version** 섹션 찾기
4. **Node.js Version**을 `22.x` 또는 `20.x`로 변경
5. **Save** 클릭
6. **Deployments** 탭 → 최신 배포 → **Redeploy**

### 방법 2: package.json에 engines 추가 (이미 적용됨)

`package.json`에 다음을 추가했습니다:
```json
"engines": {
  "node": "18.x || 20.x || 22.x"
}
```

이것이 자동으로 감지되지만, Vercel 대시보드에서도 명시적으로 설정하는 것이 좋습니다.

## 확인

설정 후 다시 배포하면 Node.js 22.x를 사용합니다.

