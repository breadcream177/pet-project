# 챙겨펫 Android 앱 전환 계획

## 제품 방향

챙겨펫은 모바일 앱을 주 사용처로 두고, 웹은 PC 관리 화면으로 유지한다.

- Android 앱: 일정 확인, 완료 체크, 푸시 알림 수신
- Web: 반려동물/일정 관리, 계정 설정, 데이터 확인

## 기술 방향

- 인증/DB: Supabase 유지
- 웹 관리 화면: Next.js 유지
- Android 앱: Capacitor 기반으로 시작
- 앱 푸시: Firebase Cloud Messaging(FCM) 연동 예정
- 예약 발송: Supabase Edge Function 또는 서버 Cron에서 처리 예정
- 중요 일정 보조 알림: SMS/알림톡은 후속 단계에서 선택형으로 검토

## 현재 결정

1. iOS보다 Android를 먼저 지원한다.
2. 현재 Next.js 기능은 버리지 않는다.
3. PWA Web Push는 실험/보조 기능으로 낮춘다.
4. 실사용 알림의 중심은 Android 앱 + FCM으로 옮긴다.
5. 한 계정에 여러 기기 토큰을 등록하고, 알림은 모든 등록 기기로 발송한다.

## 다음 작업

1. Android Studio로 `android` 프로젝트 열기
2. Firebase 프로젝트 생성
3. Android 앱 패키지 `com.chaenggyeopet.app` 등록
4. `google-services.json`을 `android/app`에 추가
5. 앱에서 FCM 토큰을 받아 Supabase `device_tokens` 테이블에 저장
6. 서버에서 일정 시간에 미완료 일정을 조회하고 FCM 발송
