import { categoryLabels, repeatLabels } from "../data";
import { formatScheduleTime } from "../utils";
import type { ScheduleWithPet } from "../types";

type SchedulePreviewListProps = {
  schedules: ScheduleWithPet[];
};

export function SchedulePreviewList({ schedules }: SchedulePreviewListProps) {
  if (schedules.length === 0) {
    return (
      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">아직 등록된 일정이 없습니다</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          왼쪽 폼에서 첫 일정을 등록하면 오늘 화면에 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">등록된 일정</h2>
        <span className="rounded-md bg-[#eaf2e5] px-3 py-1 text-sm font-bold text-[#2f5d50]">
          {schedules.length}개
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {schedules.map((schedule) => (
          <article
            className="rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4"
            key={schedule.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold">{schedule.title}</h3>
                <p className="mt-1 text-sm text-[#746f66]">
                  {schedule.pet?.name ?? "반려동물 없음"} ·{" "}
                  {categoryLabels[schedule.category]}
                </p>
              </div>
              <time className="text-sm font-bold text-[#b56b45]">
                {formatScheduleTime(schedule.time)}
              </time>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#68735f]">
              {schedule.start_date}부터 · {repeatLabels[schedule.repeat_rule]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
