export type CalendarView = "day" | "week" | "month" | "year";

export type CalendarStore = {
  date: Date;
  view: CalendarView;
};
