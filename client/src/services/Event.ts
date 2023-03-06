import axios from "./axios";
import { Event } from "./config";
import { EventDetail, DateParams, EventListByDate } from "@/types/Event";

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

const getEventByDate = (params: DateParams) => {
  return axios<{
    message: string;
    data: EventListByDate;
  }>({
    url: Event.getByDate,
    method: "get",
    params,
  });
};

export { createEvent, deleteEvent, updateEvent, getEventByDate };
