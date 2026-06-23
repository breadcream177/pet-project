import { categoryOptions, repeatOptions } from "../data";

export function ScheduleComposer() {
  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">일정 등록 틀</h2>
      <p className="mt-2 text-sm leading-6 text-[#746f66]">
        다음 단계에서 반려동물 선택, 시간, 반복 규칙을 실제 입력값으로 연결합니다.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">일정 이름</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none"
            disabled
            placeholder="예: 저녁 산책"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">분류</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none"
            disabled
          >
            {categoryOptions.map((category) => (
              <option key={category.value}>{category.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">반복</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none"
            disabled
          >
            {repeatOptions.map((repeat) => (
              <option key={repeat.value}>{repeat.label}</option>
            ))}
          </select>
        </label>

        <button
          className="h-11 w-full cursor-not-allowed rounded-md bg-[#a8b2a4] px-4 text-sm font-semibold text-white"
          disabled
          type="button"
        >
          저장 연결 예정
        </button>
      </div>
    </section>
  );
}
