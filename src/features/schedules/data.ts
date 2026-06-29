import type { RepeatRule, ScheduleCategory } from "./types";

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

export const categoryLabels: Record<ScheduleCategory, string> = {
  care: "돌봄",
  hospital: "병원",
  meal: "밥",
  medicine: "약",
  walk: "산책",
};

export const repeatLabels: Record<RepeatRule, string> = {
  daily: "매일",
  none: "반복 없음",
  weekly: "매주",
};
