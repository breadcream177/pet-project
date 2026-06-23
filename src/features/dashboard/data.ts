import type { CalendarDay, NextAppointment, TodayTask } from "./types";

export const todayTasks: TodayTask[] = [
  { time: "08:00", label: "아침 사료", pet: "모카", done: true },
  { time: "12:30", label: "심장사상충 약", pet: "모카", done: false },
  { time: "18:40", label: "저녁 산책", pet: "모카", done: false },
  { time: "20:00", label: "눈물 자국 닦기", pet: "모카", done: false },
];

export const calendarDays: CalendarDay[] = [
  { day: "월", date: "1", hasTask: true },
  { day: "화", date: "2", hasTask: true },
  { day: "수", date: "3", hasTask: false },
  { day: "목", date: "4", hasTask: true },
  { day: "금", date: "5", hasTask: false },
  { day: "토", date: "6", hasTask: false },
  { day: "일", date: "7", hasTask: false },
];

export const nextAppointment: NextAppointment = {
  label: "다음 병원 일정",
  dateText: "6월 12일 오후 3:30",
  description:
    "예방접종과 몸무게 체크를 예약해두었어요. 하루 전 알림으로 다시 챙겨드릴게요.",
};
