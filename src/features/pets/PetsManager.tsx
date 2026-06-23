"use client";

import { useState } from "react";
import { PetForm } from "./components/PetForm";
import { PetList } from "./components/PetList";
import { petColorOptions } from "./data";
import type { Pet, PetFormValues } from "./types";

const initialFormValues: PetFormValues = {
  name: "",
  species: "강아지",
  customSpecies: "",
  color: petColorOptions[0].value,
  memo: "",
};

export function PetsManager() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [formValues, setFormValues] = useState<PetFormValues>(initialFormValues);

  const handleChange = (field: keyof PetFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const name = formValues.name.trim();
    const species =
      formValues.species === "기타"
        ? formValues.customSpecies.trim()
        : formValues.species;

    if (!name || !species) {
      return;
    }

    setPets((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        species,
        color: formValues.color,
        memo: formValues.memo.trim(),
      },
    ]);
    setFormValues(initialFormValues);
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Pets</p>
        <h1 className="mt-1 text-3xl font-bold">반려동물</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          이름, 종류, 표시 색상, 메모만 먼저 등록합니다. 자세한 건강 정보는
          프로필 상세 화면을 만들 때 분리합니다.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <PetForm
          onChange={handleChange}
          onSubmit={handleSubmit}
          values={formValues}
        />
        <PetList pets={pets} />
      </div>
    </section>
  );
}
