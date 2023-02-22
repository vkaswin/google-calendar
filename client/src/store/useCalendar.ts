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
      console.log(view);
      this.view = view;
      console.log(this.view);
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
