export type CalendarView = "week" | "month" | "year";

export type CalendarStore = {
  date: Date;
  view: CalendarView;
};
