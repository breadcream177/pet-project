# 챙겨펫 Database 설계

## 선택

챙겨펫의 1차 백엔드는 Supabase를 사용합니다.

- Auth: Supabase Auth
- Database: Supabase PostgreSQL
- Security: Row Level Security
- Deploy: Vercel

## 핵심 원칙

챙겨펫은 개인 일정 관리 앱입니다. 따라서 가장 중요한 기준은 사용자별 데이터 분리입니다.

- 사용자는 자기 반려동물만 조회/수정/삭제할 수 있습니다.
- 사용자는 자기 일정만 조회/수정/삭제할 수 있습니다.
- 반복 일정은 매일 row를 미리 만들지 않습니다.
- 완료 기록은 실제 체크한 날짜만 저장합니다.

## 테이블

### profiles

Supabase Auth 사용자와 1:1로 연결되는 사용자 프로필입니다.

```txt
id
display_name
created_at
updated_at
```

### pets

사용자별 반려동물 정보입니다.

```txt
id
user_id
name
species
color
memo
created_at
updated_at
```

### schedules

반복 규칙을 포함한 일정 원본입니다.

```txt
id
user_id
pet_id
title
category
time
repeat_rule
day_of_week
is_active
created_at
updated_at
```

`day_of_week`는 주간 반복일 때만 사용합니다. 값은 0-6 범위이며, 0은 일요일입니다.

### schedule_completions

특정 날짜에 완료한 일정 기록입니다.

```txt
id
user_id
schedule_id
completed_date
completed_at
```

`schedule_id + completed_date`는 중복 저장하지 않습니다.

## 반복 일정 저장 방식

나쁜 방식:

```txt
매일 반복 일정을 날짜별 row로 미리 생성
```

이 방식은 데이터가 계속 쌓입니다.

챙겨펫 방식:

```txt
schedules = 반복 일정 원본
schedule_completions = 완료한 날짜만 저장
```

예를 들어 "매일 오전 8시 아침 사료"는 `schedules`에 한 줄만 저장합니다. 사용자가 2026-06-23에 완료 체크하면 `schedule_completions`에 해당 날짜 기록만 한 줄 저장합니다.

## RLS 정책

모든 핵심 테이블은 Row Level Security를 켭니다.

기본 정책:

```txt
auth.uid() = user_id
```

단, `profiles`는 `id = auth.uid()` 기준으로 접근합니다.

## 초기 SQL

초기 스키마와 정책은 아래 파일에 있습니다.

```txt
supabase/migrations/0001_initial_schema.sql
```

Supabase 프로젝트를 만든 뒤 SQL Editor 또는 Supabase CLI로 실행합니다.
