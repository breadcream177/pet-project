import { petColorOptions, speciesOptions } from "../data";
import type { PetFormValues } from "../types";

type PetFormProps = {
  onChange: (field: keyof PetFormValues, value: string) => void;
  onSubmit: () => void;
  values: PetFormValues;
};

export function PetForm({ onChange, onSubmit, values }: PetFormProps) {
  const selectedSpecies =
    values.species === "기타" ? values.customSpecies.trim() : values.species;
  const canSubmit = values.name.trim().length > 0 && selectedSpecies.length > 0;

  return (
    <form
      className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-lg font-bold">반려동물 등록</h2>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">이름</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="예: 모카"
            type="text"
            value={values.name}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">종류</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
            onChange={(event) => onChange("species", event.target.value)}
            value={values.species}
          >
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </label>

        {values.species === "기타" ? (
          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">
              종류 직접 입력
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => onChange("customSpecies", event.target.value)}
              placeholder="예: 고슴도치"
              type="text"
              value={values.customSpecies}
            />
          </label>
        ) : null}

        <fieldset>
          <legend className="text-sm font-semibold text-[#4d473f]">
            표시 색상
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {petColorOptions.map((color) => (
              <label
                className="flex cursor-pointer items-center gap-2 rounded-md border border-[#d8d0c4] px-3 py-2 text-sm font-semibold"
                key={color.value}
              >
                <input
                  checked={values.color === color.value}
                  className="sr-only"
                  name="pet-color"
                  onChange={() => onChange("color", color.value)}
                  type="radio"
                />
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {color.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-semibold text-[#4d473f]">메모</span>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 py-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
            maxLength={300}
            onChange={(event) => onChange("memo", event.target.value)}
            placeholder="알레르기, 먹이면 안 되는 음식, 병원 특이사항 등"
            value={values.memo}
          />
          <span className="mt-1 block text-right text-xs text-[#746f66]">
            {values.memo.length} / 300
          </span>
        </label>
      </div>

      <button
        className="mt-5 h-11 w-full rounded-md bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:bg-[#a8b2a4]"
        disabled={!canSubmit}
        type="submit"
      >
        등록하기
      </button>
    </form>
  );
}
