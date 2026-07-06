# 챙겨펫

반려동물의 밥, 산책, 약, 병원 일정을 개인별로 관리하고, 오늘 해야 할 일을 체크할 수 있는 모바일 중심 웹/앱 서비스입니다.

현재 구현은 **Next.js 웹 앱을 기반으로 Supabase Auth/DB를 연결하고, Capacitor Android 앱에서 Firebase Cloud Messaging 알림을 받을 수 있는 구조**까지 진행되어 있습니다. 웹은 PC 관리 화면, Android 앱은 실사용 알림과 모바일 확인 화면을 목표로 합니다.

## 프로젝트 목표

- 반려동물별 반복 일정을 한곳에서 관리
- 오늘 해야 할 일정과 완료 상태를 빠르게 확인
- 사용자별 데이터 분리와 Row Level Security 적용
- Android 앱 푸시 알림 기반의 실사용 알림 구조 설계
- 포트폴리오와 면접에서 설명 가능한 단계적 구현

## 주요 기능

- Supabase Auth 기반 회원가입, 로그인, 로그아웃
- 로그인 사용자별 반려동물 등록 및 조회
- 반려동물별 일정 등록 및 조회
- 매일/매주/반복 없음 일정 규칙 처리
- 오늘 일정 완료 체크 저장
- 일정 완료 상태를 `schedule_completions`로 분리 저장
- 설정 화면에서 이메일 일부 마스킹
- Android 앱 푸시 알림 켜기/끄기
- FCM 디바이스 토큰 저장
- 앱 테스트 알림 발송
- 웹/PWA 푸시 테스트 기능 분리

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Security | Supabase Row Level Security |
| Android App | Capacitor Android |
| Push | Firebase Cloud Messaging, Web Push |
| 배포 예정 | Vercel, Supabase |

## 아키텍처

```txt
사용자
  ├─ Web Browser
  │   └─ Next.js App Router
  │       ├─ Server Components
  │       ├─ Server Actions
  │       └─ Supabase SSR Client
  │
  └─ Android App
      └─ Capacitor WebView
          └─ Next.js 화면 재사용

Next.js
  ├─ Supabase Auth
  ├─ Supabase PostgreSQL
  └─ Firebase Cloud Messaging HTTP v1

Supabase
  ├─ pets
  ├─ schedules
  ├─ schedule_completions
  ├─ device_tokens
  ├─ notification_preferences
  └─ push_subscriptions
```

## 데이터 설계 요약

반복 일정을 매일 미리 생성하지 않고, 일정 원본과 완료 기록을 분리했습니다.

- `schedules`: 반복 규칙을 가진 일정 원본
- `schedule_completions`: 특정 날짜에 사용자가 완료 체크한 기록
- `pets`: 사용자별 반려동물
- `device_tokens`: Android 앱 푸시 수신 토큰
- `notification_preferences`: 알림 사용 여부와 사전 알림 시간
- `push_subscriptions`: 웹 푸시 테스트용 구독 정보

이 구조를 선택한 이유는 반복 일정이 많아져도 DB row가 불필요하게 늘어나지 않고, 완료 기록만 날짜별로 저장할 수 있기 때문입니다.

자세한 DB 설계는 [docs/DATABASE.md](docs/DATABASE.md)를 참고합니다.

## 보안 고려

- `.env.local`은 Git에 커밋하지 않습니다.
- Firebase Admin private key는 서버 환경 변수로만 사용합니다.
- Supabase service role key는 브라우저에 노출하지 않습니다.
- 사용자 데이터는 `auth.uid() = user_id` 기준 RLS로 분리합니다.
- 화면에 표시되는 이메일은 일부 마스킹합니다.
- 알림 토큰은 알림 발송 목적으로만 저장합니다.

## 폴더 구조

```txt
src/app
```

Next.js 라우트와 페이지를 관리합니다.

```txt
src/features
```

기능별 UI, 액션, 타입, 조회 로직을 관리합니다.

```txt
src/components
```

공통 레이아웃과 공통 UI를 관리합니다.

```txt
src/lib
```

Supabase 클라이언트, 개인정보 처리 같은 공통 유틸을 관리합니다.

```txt
supabase/migrations
```

DB 테이블, 인덱스, RLS 정책 SQL을 관리합니다.

```txt
android
```

Capacitor Android 프로젝트입니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@chaenggyeo-pet.local
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

주의: `FIREBASE_PRIVATE_KEY`는 따옴표를 포함해 한 줄 문자열로 넣고, 줄바꿈은 `\n` 형태로 보관합니다.

## 실행 방법

의존성 설치:

```bash
npm.cmd install
```

웹 개발 서버 실행:

```bash
npm.cmd run dev
```

브라우저 접속:

```txt
http://localhost:3000
```

Android 에뮬레이터 개발 실행:

```bash
npm.cmd run android:dev
```

Android 개발 모드에서는 앱이 PC의 Next.js 개발 서버를 바라봅니다.

```txt
http://10.0.2.2:3000
```

따라서 Android 앱을 테스트할 때는 `npm.cmd run dev`가 먼저 켜져 있어야 합니다.

## 검증 방법

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

전체 확인:

```bash
npm.cmd run check
```

## 현재 한계와 다음 작업

- 예약 알림 자동 발송은 아직 서버 Cron 또는 Supabase Edge Function으로 분리해야 합니다.
- Android 앱은 개발 서버 연결 방식이며, 배포용 앱 빌드 전략은 별도 정리가 필요합니다.
- SMS/알림톡은 유료 외부 API가 필요하므로 후속 단계에서 선택 기능으로 검토합니다.
- 반려동물/일정 수정과 삭제 기능은 다음 MVP 단계에서 추가할 예정입니다.
- 앱 아이콘, 스플래시, 스토어 배포 문서는 아직 정리 전입니다.

## 포트폴리오 설명 포인트

- 단순 CRUD가 아니라 개인 일정 관리 도메인에 맞춰 반복 일정과 완료 기록을 분리했습니다.
- Supabase RLS로 사용자별 데이터 접근을 제한했습니다.
- 웹 관리 화면과 Android 앱을 함께 고려해 Capacitor 전환을 진행했습니다.
- 앱 푸시 알림을 위해 FCM 토큰 저장, 알림 설정, 테스트 발송 흐름을 구현했습니다.
- 개발 중 발견한 Android WebView, Next dev origin, 화면 갱신 문제를 로그 기반으로 해결했습니다.
