import { defineStore } from "pinia";
import { CalendarStore, CalendarView } from "@/types/calendar";

const useCalendar = defineStore("calendar", {
  state: (): CalendarStore => {
    return {
      date: new Date(),
      view: "year",
    };
  },
  getters: {},
  actions: {
    setView(view: CalendarView) {
      this.view = view;
    },
    setDate(date: Date) {
      this.date = date;
    },
  },
});

export default useCalendar;
