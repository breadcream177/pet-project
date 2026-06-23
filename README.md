# 챙겨펫

모바일에서 반려동물의 밥, 산책, 약, 병원 일정을 빠르게 확인하고 체크하는 웹 앱입니다.

## 목표

- 모바일 우선 반응형 웹 앱
- PWA 설치 지원
- 로그인, 회원가입, 로그아웃
- 사용자별 반려동물과 일정 데이터 분리
- 오늘 할 일 중심의 일정 확인 및 완료 체크

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel 배포 예정

## 현재 구현 상태

- 앱 공통 레이아웃
- 모바일 하단 네비게이션
- 오늘 화면 대시보드 뼈대
- 로그인, 회원가입 화면 뼈대
- 일정, 반려동물, 설정 페이지 라우팅
- 반려동물 등록 MVP
- Supabase 브라우저/서버 클라이언트 기초 설정
- Supabase 초기 DB 스키마와 RLS 정책 문서

현재 반려동물 등록 데이터는 브라우저 메모리 상태로만 관리됩니다. 새로고침하면 사라지며, 서버나 DB에는 저장하지 않습니다. Supabase 연결 후 실제 사용자별 저장으로 교체할 예정입니다.

## 환경 변수

Supabase 연결 전에는 `.env.example`을 참고해 `.env.local`을 만들어야 합니다.

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env.local`은 Git에 커밋하지 않습니다.

## 실행 방법

```bash
npm.cmd install
npm.cmd run dev
```

개발 서버:

```txt
http://localhost:3000
```

## 검사 방법

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

전체 확인:

```bash
npm.cmd run check
```

## 주요 폴더

```txt
src/app
```

페이지 라우팅을 담당합니다. 예를 들어 `src/app/pets/page.tsx`는 `/pets` 주소가 됩니다.

```txt
src/components
```

여러 페이지에서 함께 쓰는 공통 UI를 둡니다.

```txt
src/features
```

기능별 코드를 둡니다. 예를 들어 반려동물 기능은 `src/features/pets`에 둡니다.

```txt
src/lib/supabase
```

Supabase 브라우저/서버 클라이언트를 둡니다.

```txt
supabase/migrations
```

Supabase DB 스키마와 RLS 정책 SQL을 둡니다.
