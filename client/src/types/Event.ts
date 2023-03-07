import { Ref } from "vue";
import EventPopup from "@/components/EventPopup.vue";

export type CalendarView = "day" | "week" | "month" | "year";

export type EventDetail = {
  readonly _id?: string;
  date: string;
  description: string;
  time: number;
  title: string;
  completed?: boolean;
};

export type EventPopUpType = Ref<InstanceType<typeof EventPopup>>;

export type DateParams = {
  startDate: string;
  endDate: string;
};

export type EventByDateAndTime = Record<
  string,
  {
    [key in number]?: EventDetail[];
  }
>;

export type EventByDate = Record<string, EventDetail[]>;

export type PageMeta = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};
