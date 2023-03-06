import { Ref } from "vue";
import { AxiosPromise } from "axios";
import EventPopup from "@/components/EventPopup.vue";
import axios from "axios";

export type CalendarView = "day" | "week" | "month" | "year";

export type EventDetail = {
  readonly _id?: string;
  date: string;
  description: string;
  time: EventTime;
  title: string;
  completed?: boolean;
};

export type EventPopUpType = Ref<InstanceType<typeof EventPopup>>;

export type DateParams = {
  startDate: string;
  endDate: string;
};

export type GetEventByDate = <T extends "week" | "month" | "year">(
  params: DateParams & { type: T }
) => AxiosPromise<{
  message: string;
  data: T extends "week"
    ? {
        date: string;
        time: EventTime;
        events: EventDetail[];
      }[]
    : T extends "month"
    ? { date: string; events: EventDetail[] }[]
    : EventDetail[];
}>;

export type EventTime =
  | "12:00 PM - 1:00 AM"
  | "1:00 AM - 2:00 AM"
  | "2:00 AM - 3:00 AM"
  | "3:00 AM - 4:00 AM"
  | "4:00 AM - 5:00 AM"
  | "5:00 AM - 6:00 AM"
  | "6:00 AM - 7:00 AM"
  | "7:00 AM - 8:00 AM"
  | "8:00 AM - 9:00 AM"
  | "9:00 AM - 10:00 AM"
  | "10:00 AM - 11:00 AM"
  | "11:00 AM - 12:00 AM"
  | "12:00 AM - 1:00 PM"
  | "1:00 PM - 2:00 PM"
  | "2:00 PM - 3:00 PM"
  | "3:00 PM - 4:00 PM"
  | "4:00 PM - 5:00 PM"
  | "5:00 PM - 6:00 PM"
  | "6:00 PM - 7:00 PM"
  | "7:00 PM - 8:00 PM"
  | "8:00 PM - 9:00 PM"
  | "9:00 PM - 10:00 PM"
  | "10:00 PM - 11:00 PM"
  | "11:00 PM - 12:00 PM";

export type TimeSlots = { time: EventTime; label: string }[];

export type EventByWeek = Record<
  string,
  {
    [key in EventTime]?: EventDetail[];
  }
>;

export type EventByMonth = Record<string, EventDetail[]>;
