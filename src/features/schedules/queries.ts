import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Pet } from "@/features/pets/types";
import {
  getKoreaTodayDate,
  isScheduleDueOnDate,
  formatScheduleTime,
} from "./utils";
import type { ScheduleWithPet, TodayScheduleItem } from "./types";

type ScheduleWithRequiredPet = ScheduleWithPet & {
  pet: NonNullable<ScheduleWithPet["pet"]>;
};

export async function getPetsForUser(userId: string): Promise<Pet[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getSchedulesForUser(
  userId: string,
): Promise<ScheduleWithPet[]> {
  const supabase = await createSupabaseServerClient();
  const [pets, schedulesResponse] = await Promise.all([
    getPetsForUser(userId),
    supabase
      .from("schedules")
      .select("*")
      .eq("user_id", userId)
      .order("time", { ascending: true }),
  ]);
  const petMap = new Map(pets.map((pet) => [pet.id, pet]));
  const schedules = schedulesResponse.data ?? [];

  return schedules.map((schedule) => ({
    ...schedule,
    pet: petMap.get(schedule.pet_id) ?? null,
  }));
}

export async function getTodayScheduleItems(
  userId: string,
  date = getKoreaTodayDate(),
): Promise<TodayScheduleItem[]> {
  const supabase = await createSupabaseServerClient();
  const [schedules, completionsResponse] = await Promise.all([
    getSchedulesForUser(userId),
    supabase
      .from("schedule_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed_date", date),
  ]);
  const completions = completionsResponse.data ?? [];
  const completionMap = new Map(
    completions.map((completion) => [completion.schedule_id, completion]),
  );

  return schedules
    .filter((schedule): schedule is ScheduleWithRequiredPet =>
      Boolean(schedule.pet) && isScheduleDueOnDate(schedule, date),
    )
    .map((schedule) => {
      const completion = completionMap.get(schedule.id);

      return {
        category: schedule.category,
        completed: Boolean(completion),
        completionId: completion?.id ?? null,
        id: schedule.id,
        petColor: schedule.pet?.color ?? "#2f5d50",
        petName: schedule.pet?.name ?? "알 수 없음",
        repeatRule: schedule.repeat_rule,
        time: formatScheduleTime(schedule.time),
        title: schedule.title,
      };
    });
}
