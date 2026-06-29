"use client";

import { useState, useTransition } from "react";
import { createPetAction } from "./actions";
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

type PetsManagerProps = {
  pets: Pet[];
};

export function PetsManager({ pets }: PetsManagerProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<PetFormValues>(initialFormValues);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof PetFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    setErrorMessage("");

    startTransition(async () => {
      const result = await createPetAction(formValues);

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      setFormValues(initialFormValues);
    });
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Pets</p>
        <h1 className="mt-1 text-3xl font-bold">반려동물</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          이름, 종류, 표시 색상, 메모를 등록합니다. 저장된 정보는 로그인한
          사용자에게만 보입니다.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <PetForm
          errorMessage={errorMessage}
          isSubmitting={isPending}
          onChange={handleChange}
          onSubmit={handleSubmit}
          values={formValues}
        />
        <PetList pets={pets} />
      </div>
    </section>
  );
}
