export default function SchedulesPage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Schedules</p>
        <h1 className="mt-1 text-3xl font-bold">일정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          밥, 산책, 약, 병원 같은 반복 일정을 만들고 확인할 화면입니다.
        </p>
      </div>

      <div className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">일정 목록 준비 중</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          다음 단계에서 일정 추가 버튼, 반복 규칙, 완료 체크를 연결합니다.
        </p>
      </div>
    </section>
  );
}
