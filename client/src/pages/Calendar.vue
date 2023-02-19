<script setup lang="ts">
import WeekCalendar from "@/components/Calendar/WeekCalendar.vue";
import MonthCalendar from "@/components/Calendar/MonthCalendar.vue";
import YearCalendar from "@/components/Calendar/YearCalendar.vue";
import DatePicker from "@/components/Calendar/DatePicker.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";

let calendarStore = useCalendar();
let { setCalendarView } = calendarStore;
let { calendarView } = storeToRefs(calendarStore);

let date;
</script>

<template>
  <div :class="styles.header">
    <div :class="styles.logo">
      <img src="../assets/images/calendar.png" />
      <span>Calender</span>
    </div>
  </div>
  <div :class="styles.container">
    <div :class="styles.sidebar">
      <DatePicker />
    </div>
    <div :class="styles.calendar">
      <WeekCalendar v-if="calendarView === 'week'" />
      <MonthCalendar v-if="calendarView === 'month'" />
      <YearCalendar v-if="calendarView === 'year'" />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.header {
  position: sticky;
  top: 0px;
  left: 0px;
  widows: 100%;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #d9dbe0;
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 44px;
      height: 40px;
    }
    span {
      color: #3c4043;
      font-family: "Poppins-Medium", sans-serif;
      font-size: 20px;
    }
  }
}
.container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 15px;
  padding: 15px;
  .sidebar {
  }
  .calendar {
  }
}
</style>
