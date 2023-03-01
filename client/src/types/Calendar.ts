declare module "vue" {
  interface ComponentCustomProperties {
    $iconUrl: string;
  }
}

export type CalendarView = "day" | "week" | "month" | "year";
