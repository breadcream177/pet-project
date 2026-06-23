import type { ScheduleDraft } from "../types";

type SchedulePreviewListProps = {
  schedules: ScheduleDraft[];
};

export function SchedulePreviewList({ schedules }: SchedulePreviewListProps) {
  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">일정 미리보기</h2>
        <span className="rounded-md bg-[#eaf2e5] px-3 py-1 text-sm font-bold text-[#2f5d50]">
          {schedules.length}개
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {schedules.map((schedule) => (
          <article
            className="rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4"
            key={`${schedule.petName}-${schedule.title}-${schedule.time}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold">{schedule.title}</h3>
                <p className="mt-1 text-sm text-[#746f66]">{schedule.petName}</p>
              </div>
              <time className="text-sm font-bold text-[#b56b45]">
                {schedule.time}
              </time>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#68735f]">
              반복: {schedule.repeatRule}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
