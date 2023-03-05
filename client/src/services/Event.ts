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

export { createEvent, getEventByDate };
