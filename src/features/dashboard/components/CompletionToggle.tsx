"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <button
      aria-pressed={completed}
      aria-label={completed ? "완료 취소" : "완료하기"}
      className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-base font-bold transition ${
        completed
          ? "border-[#2f5d50] bg-[#2f5d50] text-white"
          : "border-[#cfc5b7] bg-white text-transparent hover:border-[#2f5d50]"
      } ${isPending ? "opacity-60" : ""}`}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleScheduleCompletionAction(
            scheduleId,
            completed,
          );

          if (!result.error) {
            router.refresh();
          }
        });
      }}
      type="button"
    >
      ✓
    </button>
  );
}
