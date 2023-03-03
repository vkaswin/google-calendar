import { EventDetail } from "@/types/Calendar";
import axios from "./axios";
import { Event } from "./config";

const createEvent = (data: EventDetail) => {
  return axios<{ message: string; data: EventDetail }>({
    url: Event.create,
    method: "post",
    data,
  });
};

export { createEvent };
