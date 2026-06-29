"use client";

import { useTransition } from "react";
import { toggleScheduleCompletionAction } from "@/features/schedules/actions";

type CompletionToggleProps = {
  completed: boolean;
  scheduleId: string;
};

export function CompletionToggle({
  completed,
  scheduleId,
}: CompletionToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={completed ? "완료 취소" : "완료하기"}
      className={`h-8 w-8 rounded-full border-2 transition ${
        completed
          ? "border-[#2f5d50] bg-[#2f5d50]"
          : "border-[#cfc5b7] bg-white"
      } ${isPending ? "opacity-60" : ""}`}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleScheduleCompletionAction(scheduleId, completed);
        });
      }}
      type="button"
    />
  );
}
