"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/features/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getKoreaTodayDate, getWeekdayFromDate } from "./utils";
import type { ScheduleFormValues } from "./types";

export type ScheduleActionResult = {
  error?: string;
};

export async function createScheduleAction(
  values: ScheduleFormValues,
): Promise<ScheduleActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const title = values.title.trim();

  if (!title) {
    return { error: "일정 이름을 입력해 주세요." };
  }

  if (!values.petId) {
    return { error: "반려동물을 선택해 주세요." };
  }

  if (!values.startDate) {
    return { error: "시작일을 선택해 주세요." };
  }

  const { data: pet } = await supabase
    .from("pets")
    .select("id")
    .eq("id", values.petId)
    .eq("user_id", user.id)
    .single();

  if (!pet) {
    return { error: "선택한 반려동물을 찾을 수 없습니다." };
  }

  const { error } = await supabase.from("schedules").insert({
    category: values.category,
    day_of_week:
      values.repeatRule === "weekly" ? getWeekdayFromDate(values.startDate) : null,
    pet_id: values.petId,
    repeat_rule: values.repeatRule,
    start_date: values.startDate,
    time: values.time,
    title,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/schedules");

  return {};
}

export async function toggleScheduleCompletionAction(
  scheduleId: string,
  completed: boolean,
  date = getKoreaTodayDate(),
): Promise<ScheduleActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: schedule } = await supabase
    .from("schedules")
    .select("id")
    .eq("id", scheduleId)
    .eq("user_id", user.id)
    .single();

  if (!schedule) {
    return { error: "일정을 찾을 수 없습니다." };
  }

  if (completed) {
    const { error } = await supabase
      .from("schedule_completions")
      .delete()
      .eq("schedule_id", scheduleId)
      .eq("completed_date", date)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("schedule_completions").insert({
      completed_date: date,
      schedule_id: scheduleId,
      user_id: user.id,
    });

    if (error && error.code !== "23505") {
      return { error: error.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/schedules");

  return {};
}
