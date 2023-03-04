import { Ref } from "vue";
import EventPopup from "@/components/EventPopup.vue";

export type CalendarView = "day" | "week" | "month" | "year";

export type EventDetail = {
  readonly _id?: string;
  date: string;
  description: string;
  time: string;
  title: string;
};

export type EventPopUpType = Ref<InstanceType<typeof EventPopup>>;
