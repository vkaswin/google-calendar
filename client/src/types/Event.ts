import { Ref } from "vue";
import EventPopup from "@/components/EventPopup.vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $publicPath?: string;
  }
}

export type CalendarView = "day" | "week" | "month" | "year";

export type EventDetail = {
  _id?: string;
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
