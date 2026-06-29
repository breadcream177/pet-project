import type { Database } from "@/types/database";
import type { Pet } from "@/features/pets/types";

export type ScheduleCategory =
  Database["public"]["Enums"]["schedule_category"];

export type RepeatRule = Database["public"]["Enums"]["repeat_rule"];

export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];

export type ScheduleFormValues = {
  category: ScheduleCategory;
  petId: string;
  repeatRule: RepeatRule;
  startDate: string;
  time: string;
  title: string;
};

export type ScheduleWithPet = Schedule & {
  pet: Pick<Pet, "color" | "id" | "name" | "species"> | null;
};

export type TodayScheduleItem = {
  category: ScheduleCategory;
  completed: boolean;
  completionId: string | null;
  id: string;
  petColor: string;
  petName: string;
  repeatRule: RepeatRule;
  time: string;
  title: string;
};
