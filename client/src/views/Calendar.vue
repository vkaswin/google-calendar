<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import Loader from "@/components/Loader.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";
import useAuth from "@/store/useAuth";

const WeekCalendar = defineAsyncComponent({
  loader: () => import("@/components/WeekCalendar.vue"),
  loadingComponent: Loader,
});

const MonthCalendar = defineAsyncComponent({
  loader: () => import("@/components/MonthCalendar.vue"),
  loadingComponent: Loader,
});

const YearCalendar = defineAsyncComponent({
  loader: () => import("@/components/YearCalendar.vue"),
  loadingComponent: Loader,
});

let auth = useAuth();

let calendar = useCalendar();

let { setView, setDate } = calendar;

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

const handleNext = () => {
  let temp = structuredClone(date.value);

  switch (view.value) {
    case "day":
      temp.setDate(temp.getDate() + 1);
      break;
    case "week":
      temp.setDate(temp.getDate() + 7);
      break;
    case "month":
      temp.setMonth(temp.getMonth() + 1);
      break;
    case "year":
      temp.setFullYear(temp.getFullYear() + 1);
      break;
    default:
      return;
  }

  sideBar.value?.datePicker?.setCurrentDate(temp);
  setDate(temp);
};

const handlePrevious = () => {
  let temp = structuredClone(date.value);

  switch (view.value) {
    case "day":
      temp.setDate(temp.getDate() - 1);
      break;
    case "week":
      temp.setDate(temp.getDate() - 7);
      break;
    case "month":
      temp.setMonth(temp.getMonth() - 1);
      break;
    case "year":
      temp.setFullYear(temp.getFullYear() - 1);
      break;
    default:
      return;
  }

  sideBar.value?.datePicker?.setCurrentDate(temp);
  setDate(temp);
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
      <WeekCalendar
        v-if="view === 'week' || view === 'day'"
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
