import { defineStore } from "pinia";
import { CalendarStore, CalendarView } from "@/types/calendar";

const useCalendar = defineStore("calendar", {
  state: (): CalendarStore => {
    return {
      calendarView: "week",
    };
  },
  getters: {},
  actions: {
    setCalendarView(calendarView: CalendarView) {
      this.calendarView = calendarView;
    },
  },
});

export default useCalendar;
