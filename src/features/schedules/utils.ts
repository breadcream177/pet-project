import type { Schedule } from "./types";

export function getKoreaTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(new Date());
}

export function getWeekdayFromDate(date: string) {
  return new Date(`${date}T00:00:00+09:00`).getUTCDay();
}

export function formatScheduleTime(time: string) {
  return time.slice(0, 5);
}

export function isScheduleDueOnDate(schedule: Schedule, date: string) {
  if (schedule.start_date > date || !schedule.is_active) {
    return false;
  }

  if (schedule.repeat_rule === "daily") {
    return true;
  }

  if (schedule.repeat_rule === "weekly") {
    return schedule.day_of_week === getWeekdayFromDate(date);
  }

  return schedule.start_date === date;
}
