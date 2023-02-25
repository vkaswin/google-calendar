import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { CalendarStore, CalendarView } from "@/types/calendar";

const useCalendar = defineStore("calendar", {
  state: (): CalendarStore => {
    let { query } = useRoute();

    return {
      date: query.date ? new Date(query.date as string) : new Date(),
      view: (query.view as CalendarView) || "week",
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
