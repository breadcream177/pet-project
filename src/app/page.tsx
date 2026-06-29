import { DashboardHome } from "@/features/dashboard/DashboardHome";
import type { CalendarDay, NextAppointment } from "@/features/dashboard/types";
import { requireCurrentUser } from "@/features/auth/server";
import { getTodayScheduleItems } from "@/features/schedules/queries";
import { getKoreaTodayDate, getWeekdayFromDate } from "@/features/schedules/utils";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

function getTodayDateText(date: string) {
  const weekday = dayLabels[getWeekdayFromDate(date)];
  const [, month, day] = date.split("-");

  return `${Number(month)}월 ${Number(day)}일 ${weekday}요일`;
}

function getCalendarDays(date: string, hasTaskToday: boolean): CalendarDay[] {
  const today = new Date(`${date}T00:00:00+09:00`);
  const todayDay = today.getUTCDay();

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(today);
    current.setUTCDate(today.getUTCDate() - todayDay + index);

    return {
      date: String(current.getUTCDate()),
      day: dayLabels[index],
      hasTask:
        current.getUTCFullYear() === today.getUTCFullYear() &&
        current.getUTCMonth() === today.getUTCMonth() &&
        current.getUTCDate() === today.getUTCDate() &&
        hasTaskToday,
    };
  });
}

function getNextAppointment(
  todayTasks: Awaited<ReturnType<typeof getTodayScheduleItems>>,
): NextAppointment | null {
  const hospitalTask = todayTasks.find((task) => task.category === "hospital");

  if (!hospitalTask) {
    return null;
  }

  return {
    dateText: `오늘 ${hospitalTask.time}`,
    description: `${hospitalTask.petName}의 ${hospitalTask.title} 일정이 있습니다.`,
    label: "다음 병원 일정",
  };
}

export default async function Home() {
  const user = await requireCurrentUser();
  const today = getKoreaTodayDate();
  const todayTasks = await getTodayScheduleItems(user.id, today);

  return (
    <DashboardHome
      calendarDays={getCalendarDays(today, todayTasks.length > 0)}
      nextAppointment={getNextAppointment(todayTasks)}
      todayDateText={getTodayDateText(today)}
      todayTasks={todayTasks}
    />
  );
}
