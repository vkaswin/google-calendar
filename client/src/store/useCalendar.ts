import { defineStore } from "pinia";
import { CalendarStore, CalendarView } from "@/types/calendar";

const useCalendar = defineStore("calendar", {
  state: (): CalendarStore => {
    return {
      date: new Date(),
      view: "week",
    };
  },
  getters: {},
  actions: {
    setView(view: CalendarView) {
      this.view = view;
    },
  },
});

export default useCalendar;
