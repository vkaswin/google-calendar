import { defineStore } from "pinia";
import { CalendarStore, CalendarView } from "@/types/calendar";

const useCalendar = defineStore("calendar", {
  state: (): CalendarStore => {
    return {
      date: new Date(),
      view: "month",
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
    handleNext() {
      console.log(
        "🚀 ~ file: useCalendar.ts:22 ~ handleNext ~ this.date,this.view:",
        this.date,
        this.view
      );
    },
    handlePrevious() {
      console.log(
        "🚀 ~ file: useCalendar.ts:22 ~ handlePrevious ~ this.date,this.view:",
        this.date,
        this.view
      );
    },
  },
});

export default useCalendar;
