import { NextAppointmentCard } from "./components/NextAppointmentCard";
import { TodayTaskList } from "./components/TodayTaskList";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { calendarDays, nextAppointment, todayTasks } from "./data";

export function DashboardHome() {
  const completedCount = todayTasks.filter((task) => task.done).length;

  return (
    <section className="flex min-h-[calc(100vh-120px)] flex-col">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#68735f]">오늘의 돌봄</p>
          <h1 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">
            오늘 챙길 일정
          </h1>
        </div>
        <button className="h-11 rounded-md bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42]">
          일정 추가
        </button>
      </header>

      <div className="grid flex-1 gap-5 py-7 lg:grid-cols-[1.1fr_0.9fr]">
        <TodayTaskList
          completedCount={completedCount}
          tasks={todayTasks}
          totalCount={todayTasks.length}
        />

        <aside className="grid gap-5">
          <WeeklyCalendar days={calendarDays} />
          <NextAppointmentCard appointment={nextAppointment} />
        </aside>
      </div>
    </section>
  );
}
