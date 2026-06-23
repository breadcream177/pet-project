export type TodayTask = {
  time: string;
  label: string;
  pet: string;
  done: boolean;
};

export type CalendarDay = {
  day: string;
  date: string;
  hasTask: boolean;
};

export type NextAppointment = {
  label: string;
  dateText: string;
  description: string;
};
