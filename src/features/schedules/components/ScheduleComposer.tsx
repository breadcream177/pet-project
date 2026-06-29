import type { Pet } from "@/features/pets/types";
import { categoryOptions, repeatOptions } from "../data";
import type { ScheduleFormValues } from "../types";

type ScheduleComposerProps = {
  errorMessage?: string;
  isSubmitting?: boolean;
  onChange: (field: keyof ScheduleFormValues, value: string) => void;
  onSubmit: () => void;
  pets: Pet[];
  values: ScheduleFormValues;
};

export function ScheduleComposer({
  errorMessage = "",
  isSubmitting = false,
  onChange,
  onSubmit,
  pets,
  values,
}: ScheduleComposerProps) {
  const canSubmit =
    pets.length > 0 &&
    values.title.trim().length > 0 &&
    values.petId.length > 0 &&
    values.startDate.length > 0 &&
    values.time.length > 0 &&
    !isSubmitting;

  return (
    <form
      className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-lg font-bold">일정 등록</h2>
      <p className="mt-2 text-sm leading-6 text-[#746f66]">
        반복 없음은 시작일 하루만, 매일/매주는 시작일 이후부터 오늘 할 일에
        반영됩니다.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">반려동물</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
            disabled={pets.length === 0}
            onChange={(event) => onChange("petId", event.target.value)}
            value={values.petId}
          >
            {pets.length === 0 ? (
              <option value="">먼저 반려동물을 등록해 주세요</option>
            ) : null}
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">일정 이름</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="예: 저녁 산책"
            type="text"
            value={values.title}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">분류</span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => onChange("category", event.target.value)}
              value={values.category}
            >
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">시간</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => onChange("time", event.target.value)}
              type="time"
              value={values.time}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">시작일</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => onChange("startDate", event.target.value)}
              type="date"
              value={values.startDate}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">반복</span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => onChange("repeatRule", event.target.value)}
              value={values.repeatRule}
            >
              {repeatOptions.map((repeat) => (
                <option key={repeat.value} value={repeat.value}>
                  {repeat.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#9f3f2f]">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="mt-5 h-11 w-full rounded-md bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:bg-[#a8b2a4]"
        disabled={!canSubmit}
        type="submit"
      >
        {isSubmitting ? "저장 중..." : "일정 저장"}
      </button>
    </form>
  );
}
