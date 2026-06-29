import { CompletionToggle } from "./CompletionToggle";
import type { TodayScheduleItem } from "@/features/schedules/types";

type TodayTaskListProps = {
  completedCount: number;
  tasks: TodayScheduleItem[];
  todayDateText: string;
  totalCount: number;
};

export function TodayTaskList({
  completedCount,
  tasks,
  todayDateText,
  totalCount,
}: TodayTaskListProps) {
  return (
    <section className="flex flex-col rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#68735f]">오늘 할 일</p>
          <h2 className="mt-2 text-2xl font-bold">{todayDateText}</h2>
        </div>
        <div className="rounded-md bg-[#eaf2e5] px-3 py-2 text-right">
          <p className="text-xs font-semibold text-[#68735f]">완료</p>
          <p className="text-lg font-bold">
            {completedCount} / {totalCount}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4">
            <h3 className="font-semibold">오늘 등록된 일정이 없습니다</h3>
            <p className="mt-2 text-sm leading-6 text-[#746f66]">
              일정 페이지에서 첫 일정을 등록해보세요.
            </p>
          </div>
        ) : null}

        {tasks.map((task) => (
          <article
            className="grid grid-cols-[64px_1fr_32px] items-center gap-4 rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4"
            key={task.id}
          >
            <time className="text-sm font-bold text-[#b56b45]">{task.time}</time>
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="mt-1 text-sm text-[#746f66]">{task.petName}</p>
            </div>
            <CompletionToggle completed={task.completed} scheduleId={task.id} />
          </article>
        ))}
      </div>
    </section>
  );
}
