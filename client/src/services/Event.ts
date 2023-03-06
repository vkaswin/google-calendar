import axios from "./axios";
import { Event } from "./config";
import { EventDetail, GetEventByDate } from "@/types/Event";

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

const getEventByDate: GetEventByDate = (params) => {
  return axios({
    url: Event.getByDate,
    method: "get",
    params,
  }) as any;
};

export { createEvent, deleteEvent, updateEvent, getEventByDate };
