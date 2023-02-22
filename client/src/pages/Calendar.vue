<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Header from "@/components/Calendar/Header.vue";
import SideBar from "@/components/Calendar/SideBar.vue";
import Loader from "@/components/Calendar/Loader.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";

const WeekCalendar = defineAsyncComponent({
  loader: () => import("@/components/Calendar/WeekCalendar.vue"),
  loadingComponent: Loader,
});

const MonthCalendar = defineAsyncComponent({
  loader: () => import("@/components/Calendar/MonthCalendar.vue"),
  loadingComponent: Loader,
});

const YearCalendar = defineAsyncComponent({
  loader: () => import("@/components/Calendar/YearCalendar.vue"),
  loadingComponent: Loader,
});

let calendarStore = useCalendar();

let { setView, setDate, handleNext, handlePrevious } = calendarStore;

let { view, date } = storeToRefs(calendarStore);

let isOpen = ref(true);

let sideBar = ref<InstanceType<typeof SideBar>>();

let toggle = () => {
  isOpen.value = !isOpen.value;
};

let reset = () => {
  let date = new Date();
  sideBar.value?.datePicker?.setCurrentDate(date);
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
    @on-view-change="setView"
  />
  <div :class="styles.container">
    <SideBar ref="sideBar" :date="date" :isOpen="isOpen" @on-change="setDate" />
    <div :class="styles.calendar" :aria-expanded="isOpen">
      <WeekCalendar
        v-if="view === 'week' || view === 'day'"
        :selected-date="date"
      />
      <MonthCalendar
        v-else-if="view === 'month'"
        :selected-date="date"
        @on-change="handleChange"
      />
      <YearCalendar
        v-else-if="view === 'year'"
        :selected-date="date"
        @on-change="setDate"
      />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  position: relative;
  .calendar {
    padding: 15px;
    transition-property: left, width;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }
}

.container[aria-expanded="true"] {
  width: calc(100% - var(--sidebar-width));
  left: var(--sidebar-width);
}

.container[aria-expanded="false"] {
  width: 100%;
  left: 0px;
}
</style>
