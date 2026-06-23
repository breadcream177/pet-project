import type { CalendarDay } from "../types";

type WeeklyCalendarProps = {
  days: CalendarDay[];
};

export function WeeklyCalendar({ days }: WeeklyCalendarProps) {
  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">이번 주</h2>
        <p className="text-sm font-semibold text-[#68735f]">June</p>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            className="flex aspect-square flex-col items-center justify-center rounded-md border border-[#eee7dc] bg-[#fbfaf7]"
            key={day.day}
          >
            <span className="text-xs font-semibold text-[#746f66]">{day.day}</span>
            <span className="mt-1 text-lg font-bold">{day.date}</span>
            <span
              className={`mt-1 h-1.5 w-1.5 rounded-full ${
                day.hasTask ? "bg-[#b56b45]" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
