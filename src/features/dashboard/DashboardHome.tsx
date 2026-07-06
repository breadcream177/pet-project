import { NextAppointmentCard } from "./components/NextAppointmentCard";
import { TodayReminderSetup } from "./components/TodayReminderSetup";
import { TodayTaskList } from "./components/TodayTaskList";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import type { CalendarDay, NextAppointment } from "./types";
import type { TodayScheduleItem } from "@/features/schedules/types";

type DashboardHomeProps = {
  calendarDays: CalendarDay[];
  nextAppointment: NextAppointment | null;
  todayDateText: string;
  todayTasks: TodayScheduleItem[];
};

export function DashboardHome({
  calendarDays,
  nextAppointment,
  todayDateText,
  todayTasks,
}: DashboardHomeProps) {
  const completedCount = todayTasks.filter((task) => task.completed).length;

  return (
    <section className="flex min-h-[calc(100vh-120px)] flex-col">
      <TodayReminderSetup tasks={todayTasks} />

      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#68735f]">오늘의 돌봄</p>
          <h1 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">
            오늘 챙길 일정
          </h1>
        </div>
        <a
          className="h-11 rounded-md bg-[#2f5d50] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42]"
          href="/schedules"
        >
          일정 추가
        </a>
      </header>

      <div className="grid flex-1 gap-5 py-7 lg:grid-cols-[1.1fr_0.9fr]">
        <TodayTaskList
          completedCount={completedCount}
          tasks={todayTasks}
          todayDateText={todayDateText}
          totalCount={todayTasks.length}
        />

        <aside className="grid gap-5">
          <WeeklyCalendar days={calendarDays} />
          {nextAppointment ? (
            <NextAppointmentCard appointment={nextAppointment} />
          ) : (
            <section className="rounded-lg border border-[#ddd6c8] bg-[#2f5d50] p-5 text-white shadow-sm">
              <p className="text-sm font-semibold text-[#d7ead1]">병원 일정</p>
              <h2 className="mt-3 text-2xl font-bold">
                등록된 병원 일정 없음
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#eef7ea]">
                병원 일정을 등록하면 가장 가까운 일정이 이곳에 표시됩니다.
              </p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
