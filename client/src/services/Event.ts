import axios from "./axios";
import { Event } from "./config";
import { DateParams, EventDetail, EventTime, PageMeta } from "@/types/Event";

const createEvent = (data: EventDetail) => {
  return axios<{ message: string; data: EventDetail }>({
    url: Event.create,
    method: "post",
    data,
  });
};

const deleteEvent = (id: string) => {
  return axios<{ message: string }>({
    url: Event.delete(id),
    method: "delete",
  });
};

const updateEvent = (id: string, data: Partial<EventDetail>) => {
  return axios<{ message: string; data: EventDetail }>({
    url: Event.update(id),
    method: "put",
    data,
  });
};

const getEventByDate = <T extends "week" | "month" | "year">(
  params: { type: T } & DateParams
) => {
  return axios<{
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
  }>({
    url: Event.getByDate,
    method: "get",
    params,
  });
};

const searchEvents = (params: {
  search: string;
  page: number;
  limit: number;
}) => {
  return axios<{
    message: string;
    data: { list: EventDetail[]; pageMeta: PageMeta };
  }>({
    url: Event.search,
    method: "get",
    params,
  });
};

export { createEvent, deleteEvent, updateEvent, getEventByDate, searchEvents };
