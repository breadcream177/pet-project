import type { TodayTask } from "../types";

type TodayTaskListProps = {
  completedCount: number;
  tasks: TodayTask[];
  totalCount: number;
};

export function TodayTaskList({
  completedCount,
  tasks,
  totalCount,
}: TodayTaskListProps) {
  return (
    <section className="flex flex-col rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#68735f]">오늘 할 일</p>
          <h2 className="mt-2 text-2xl font-bold">6월 4일 목요일</h2>
        </div>
        <div className="rounded-md bg-[#eaf2e5] px-3 py-2 text-right">
          <p className="text-xs font-semibold text-[#68735f]">완료</p>
          <p className="text-lg font-bold">
            {completedCount} / {totalCount}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((task) => (
          <article
            className="grid grid-cols-[64px_1fr_28px] items-center gap-4 rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4"
            key={`${task.time}-${task.label}`}
          >
            <time className="text-sm font-bold text-[#b56b45]">{task.time}</time>
            <div>
              <h3 className="font-semibold">{task.label}</h3>
              <p className="mt-1 text-sm text-[#746f66]">{task.pet}</p>
            </div>
            <span
              aria-label={task.done ? "완료됨" : "미완료"}
              className={`h-7 w-7 rounded-full border-2 ${
                task.done
                  ? "border-[#2f5d50] bg-[#2f5d50]"
                  : "border-[#cfc5b7] bg-white"
              }`}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
