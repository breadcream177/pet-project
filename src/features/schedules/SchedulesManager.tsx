import { ScheduleComposer } from "./components/ScheduleComposer";
import { SchedulePreviewList } from "./components/SchedulePreviewList";
import { scheduleDrafts } from "./data";

export function SchedulesManager() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Schedules</p>
        <h1 className="mt-1 text-3xl font-bold">일정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          오늘 할 일, 일정 등록, 반복 규칙이 들어갈 기본 화면입니다. 실제 저장은
          인증과 DB 연결 뒤에 붙입니다.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <ScheduleComposer />
        <SchedulePreviewList schedules={scheduleDrafts} />
      </div>
    </section>
  );
}
