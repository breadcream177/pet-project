export type ScheduleCategory = "meal" | "walk" | "medicine" | "hospital" | "care";

export type RepeatRule = "none" | "daily" | "weekly";

export type ScheduleDraft = {
  title: string;
  petName: string;
  category: ScheduleCategory;
  repeatRule: RepeatRule;
  time: string;
};
