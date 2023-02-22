<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/Calendar/Header.vue";
import SideBar from "@/components/Calendar/SideBar.vue";
import WeekCalendar from "@/components/Calendar/WeekCalendar.vue";
import MonthCalendar from "@/components/Calendar/MonthCalendar.vue";
import YearCalendar from "@/components/Calendar/YearCalendar.vue";
import DatePicker from "@/components/Calendar/DatePicker.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";

let calendarStore = useCalendar();

let { setView, setDate, handleNext, handlePrevious } = calendarStore;

let { view, date } = storeToRefs(calendarStore);

let isOpen = ref(true);

let datePicker = ref<InstanceType<typeof DatePicker>>();

let toggle = () => {
  isOpen.value = !isOpen.value;
};

let reset = () => {
  let date = new Date();
  datePicker.value?.setCurrentDate(date);
  setDate(date);
};

let handleChange = (date: Date) => {
  console.log("🚀 ~ file: Calendar.vue:35 ~ handleChange ~ date:", date);
};
</script>

<template>
  <Header
    :date="date"
    @on-next="handleNext"
    @on-previous="handlePrevious"
    @on-reset="reset"
    @on-toggle="toggle"
  />
  <SideBar :date="date" :isOpen="isOpen" @on-change="setDate" />
  <div :class="styles.calender" :aria-expanded="isOpen">
    <WeekCalendar v-if="view === 'week'" />
    <MonthCalendar
      v-if="view === 'month'"
      :selected-date="date"
      @on-change="handleChange"
    />
    <YearCalendar
      v-if="view === 'year'"
      :selected-date="date"
      @on-change="setDate"
    />
  </div>
</template>

<style lang="scss" module="styles">
.calender {
  position: relative;
  padding: calc(var(--header-height) + var(--base-padding)) var(--base-padding)
    var(--base-padding) var(--base-padding);
  transition-property: left, width;
  transition-duration: 0.25s;
  transition-timing-function: ease-in-out;
}

.calender[aria-expanded="true"] {
  width: calc(100% - var(--sidebar-width));
  left: var(--sidebar-width);
}

.calender[aria-expanded="false"] {
  width: 100%;
  left: 0px;
}
</style>
