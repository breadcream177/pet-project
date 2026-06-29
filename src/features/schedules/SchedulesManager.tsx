"use client";

import { useState, useTransition } from "react";
import type { Pet } from "@/features/pets/types";
import { createScheduleAction } from "./actions";
import { ScheduleComposer } from "./components/ScheduleComposer";
import { SchedulePreviewList } from "./components/SchedulePreviewList";
import type { ScheduleFormValues, ScheduleWithPet } from "./types";
import { getKoreaTodayDate } from "./utils";

const initialFormValues: ScheduleFormValues = {
  category: "meal",
  petId: "",
  repeatRule: "daily",
  startDate: getKoreaTodayDate(),
  time: "08:00",
  title: "",
};

type SchedulesManagerProps = {
  pets: Pet[];
  schedules: ScheduleWithPet[];
};

export function SchedulesManager({ pets, schedules }: SchedulesManagerProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<ScheduleFormValues>({
    ...initialFormValues,
    petId: pets[0]?.id ?? "",
  });
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof ScheduleFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    setErrorMessage("");

    startTransition(async () => {
      const result = await createScheduleAction(formValues);

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      setFormValues({
        ...initialFormValues,
        petId: pets[0]?.id ?? "",
      });
    });
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Schedules</p>
        <h1 className="mt-1 text-3xl font-bold">일정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          반려동물별 일정과 반복 규칙을 등록합니다. 오늘 화면에는 시작일과
          반복 규칙에 맞는 일정만 표시됩니다.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <ScheduleComposer
          errorMessage={errorMessage}
          isSubmitting={isPending}
          onChange={handleChange}
          onSubmit={handleSubmit}
          pets={pets}
          values={formValues}
        />
        <SchedulePreviewList schedules={schedules} />
      </div>
    </section>
  );
}
