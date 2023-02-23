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

let sideBar = ref<InstanceType<typeof SideBar>>();

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
    @on-view-change="setView"
  />
  <div :class="styles.container">
    <SideBar ref="sideBar" :date="date" @on-change="setDate" />
    <div :class="styles.calendar">
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
    flex-grow: 1;
  }
}
</style>
