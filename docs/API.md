# 챙겨펫 기능/API 명세

이 문서는 챙겨펫의 화면별 동작, Server Action, Route Handler, DB 접근 흐름을 정리합니다.

챙겨펫은 Next.js App Router 기반이라 전통적인 REST Controller보다 **Server Action + Supabase query** 중심으로 동작합니다.

## 인증

### 회원가입

- 화면: `/signup`
- Route Handler: `src/app/auth/signup/route.ts`
- 입력값:
  - `email`
  - `password`
- 처리:
  - Supabase Auth에 사용자 생성 요청
  - 성공 시 로그인 화면 또는 앱 화면으로 이동
- 보안:
  - 비밀번호는 앱 DB에 직접 저장하지 않고 Supabase Auth가 관리

### 로그인

- 화면: `/login`
- Route Handler: `src/app/auth/login/route.ts`
- 입력값:
  - `email`
  - `password`
- 처리:
  - Supabase Auth 세션 생성
  - 세션 쿠키 저장
  - 인증 후 홈 화면으로 이동

### 로그아웃

- 컴포넌트: `src/features/auth/components/LogoutButton.tsx`
- 처리:
  - Supabase Auth 세션 제거
  - 클라이언트 라우터 갱신

## 반려동물

### 반려동물 등록

- 화면: `/pets`
- Server Action: `createPetAction`
- 파일: `src/features/pets/actions.ts`
- 입력값:
  - `name`
  - `species`
  - `customSpecies`
  - `color`
  - `memo`
- DB:
  - `pets`
- 처리:
  - 로그인 사용자 확인
  - 이름/종류 검증
  - `user_id`를 현재 사용자 ID로 지정해 저장
  - `/pets`, `/schedules`, `/` 화면 갱신
- 보안:
  - RLS 기준 `auth.uid() = user_id`

## 일정

### 일정 등록

- 화면: `/schedules`
- Server Action: `createScheduleAction`
- 파일: `src/features/schedules/actions.ts`
- 입력값:
  - `petId`
  - `title`
  - `category`
  - `time`
  - `startDate`
  - `repeatRule`
- DB:
  - `schedules`
- 처리:
  - 로그인 사용자 확인
  - 선택한 반려동물이 현재 사용자의 반려동물인지 확인
  - 매주 반복인 경우 `startDate`에서 요일 계산
  - 일정 원본 저장
  - `/`, `/schedules` 화면 갱신
- 보안:
  - 다른 사용자의 반려동물 ID로 일정 생성 불가
  - RLS 기준 `auth.uid() = user_id`

### 오늘 일정 완료 체크

- 화면: `/`
- Server Action: `toggleScheduleCompletionAction`
- 파일: `src/features/schedules/actions.ts`
- 입력값:
  - `scheduleId`
  - `completed`
  - `date`
- DB:
  - `schedule_completions`
- 처리:
  - 일정이 현재 사용자의 일정인지 확인
  - 완료 처리 시 `schedule_completions`에 날짜별 완료 기록 저장
  - 완료 취소 시 해당 날짜 기록 삭제
  - `/`, `/schedules` 화면 갱신
- 보안:
  - 다른 사용자의 일정 완료 기록 조작 불가

## 알림

### 앱 알림 설정 저장

- 화면: `/settings`
- Server Action: `saveNotificationPreferenceAction`
- 파일: `src/features/notifications/actions.ts`
- 입력값:
  - `enabled`
  - `minutesBefore`
- DB:
  - `notification_preferences`
- 처리:
  - 알림 사용 여부 저장
  - 허용된 사전 알림 시간만 저장: `0`, `5`, `10`, `30`, `60`

### Android 디바이스 토큰 저장

- 화면: `/settings`
- 컴포넌트: `AppPushSettings`
- Server Action: `saveDeviceTokenAction`
- 파일: `src/features/notifications/actions.ts`
- 입력값:
  - `platform`
  - `token`
  - `deviceLabel`
- DB:
  - `device_tokens`
- 처리:
  - Capacitor PushNotifications에서 FCM 토큰 수신
  - `user_id + token` 기준 upsert
  - 마지막 확인 시각 갱신
- 보안:
  - 토큰은 로그인 사용자 ID와 함께 저장
  - 토큰은 알림 발송 목적으로만 사용

### Android 테스트 알림 발송

- 화면: `/settings`
- Server Action: `sendTestAppPushNotificationAction`
- 파일: `src/features/notifications/actions.ts`
- 외부 API:
  - Firebase Cloud Messaging HTTP v1
- 처리:
  - 현재 사용자의 Android device token 조회
  - Firebase Admin 서비스 계정 정보로 OAuth access token 발급
  - FCM 메시지 발송
- 환경 변수:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

### 웹 푸시 테스트

- 화면: `/settings`
- 컴포넌트:
  - `WebPushDeveloperPanel`
  - `NotificationSettings`
- DB:
  - `push_subscriptions`
- 용도:
  - 개발 중 웹 푸시 동작 검증용
  - Android 앱에서는 숨김 처리

## 조회 흐름

### 홈 화면

- 화면: `/`
- 주요 파일:
  - `src/features/dashboard/DashboardHome.tsx`
  - `src/features/dashboard/components/TodayTaskList.tsx`
  - `src/features/dashboard/components/WeeklyCalendar.tsx`
- 처리:
  - 현재 사용자 일정 조회
  - 오늘 날짜와 반복 규칙 기준으로 오늘 일정 계산
  - 완료 기록 조회 후 체크 상태 표시

### 반려동물 화면

- 화면: `/pets`
- 처리:
  - 현재 사용자의 `pets`만 조회

### 일정 화면

- 화면: `/schedules`
- 처리:
  - 현재 사용자의 `pets`, `schedules` 조회
  - 일정 등록 폼과 등록된 일정 목록 표시

## 에러 확인 순서

기능이 동작하지 않을 때는 전체 구조를 바꾸기 전에 아래 순서로 확인합니다.

1. 브라우저/Android 로그
2. Server Action 응답
3. Supabase RLS 정책
4. DB row 저장 여부
5. 클라이언트 화면 갱신 여부
6. Android WebView와 개발 서버 연결 상태
