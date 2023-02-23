<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Header from "@/components/Calendar/Header.vue";
import SideBar from "@/components/Calendar/SideBar.vue";
import Loader from "@/components/Calendar/Loader.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";
import useAuth from "@/store/useAuth";

const DayCalender = defineAsyncComponent({
  loader: () => import("@/components/Calendar/DayCalendar.vue"),
  loadingComponent: Loader,
});

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

let calendar = useCalendar();

let auth = useAuth();

let { setView, setDate, handleNext, handlePrevious } = calendar;

let { view, date } = storeToRefs(calendar);

let { user } = storeToRefs(auth);

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
  console.log(
    "🚀 ~ file: Calendar.vue:35 ~ handleChange ~ view, date:",
    view,
    date
  );
};
</script>

<template>
  <Header
    :user="user"
    :date="date"
    :view="view"
    @on-next="handleNext"
    @on-previous="handlePrevious"
    @on-reset="reset"
    @on-toggle="toggle"
    @on-view-change="setView"
  />
  <div :class="styles.container">
    <SideBar ref="sideBar" :date="date" :isOpen="isOpen" @on-change="setDate" />
    <div :class="styles.calendar" :aria-expanded="isOpen">
      <DayCalender v-if="view === 'day'" />
      <WeekCalendar
        v-else-if="view === 'week'"
        :view="view"
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
        @on-change="handleChange"
      />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  gap: 15px;
  height: calc(100% - var(--header-height));
  .calendar {
    height: 100%;
    flex-grow: 1;
    // transition-property: transform, width;
    // transition-duration: 0.25s;
    // transition-timing-function: ease-in-out;
  }
  //   .calendar[aria-expanded="true"] {
  //     width: calc(100% - var(--sidebar-width));
  //     transform: translateX(var(--sidebar-width));
  //   }

  //   .calendar[aria-expanded="false"] {
  //     width: 100%;
  //     transform: translateX(0px);
  //   }
}
</style>
