import type { ScheduleCategory, RepeatRule, ScheduleDraft } from "./types";

export const categoryOptions: Array<{
  label: string;
  value: ScheduleCategory;
}> = [
  { label: "밥", value: "meal" },
  { label: "산책", value: "walk" },
  { label: "약", value: "medicine" },
  { label: "병원", value: "hospital" },
  { label: "돌봄", value: "care" },
];

export const repeatOptions: Array<{
  label: string;
  value: RepeatRule;
}> = [
  { label: "반복 없음", value: "none" },
  { label: "매일", value: "daily" },
  { label: "매주", value: "weekly" },
];

export const scheduleDrafts: ScheduleDraft[] = [
  {
    title: "아침 사료",
    petName: "모카",
    category: "meal",
    repeatRule: "daily",
    time: "08:00",
  },
  {
    title: "심장사상충 약",
    petName: "모카",
    category: "medicine",
    repeatRule: "weekly",
    time: "12:30",
  },
];
