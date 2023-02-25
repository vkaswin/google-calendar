<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import Loader from "@/components/Loader.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";
import useAuth from "@/store/useAuth";
import { useRouter } from "vue-router";
import { CalendarView } from "@/types/calendar";

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

let router = useRouter();

let { setView, setDate } = calendar;

let { view, date } = storeToRefs(calendar);

let { user } = storeToRefs(auth);

let sideBar = ref<InstanceType<typeof SideBar>>();

let reset = () => {
  let date = new Date();
  sideBar.value?.datePicker?.setCurrentDate(date);
  setDate(date);
  router.push({
    query: {
      view: view.value,
      date: date.toISOString().split("T")[0],
    },
  });
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
  router.push({
    query: {
      view: view.value,
      date: temp.toISOString().split("T")[0],
    },
  });
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
  router.push({
    query: {
      view: view.value,
      date: temp.toISOString().split("T")[0],
    },
  });
};

let handleChange = (type: "date" | "week" | "month" | "year", date: Date) => {
  console.log(
    "🚀 ~ file: Calendar.vue:92 ~ handleChange ~ date, type",
    date,
    type
  );
  switch (type) {
    case "date":
      setDate(date);
      break;
    case "week":
      setView("day");
      setDate(date);
      break;
    case "month":
      break;
    case "year":
      break;
    default:
      return;
  }

  router.push({
    query: {
      view: view.value,
      date: date.toISOString().split("T")[0],
    },
  });
};

let handleViewChange = (view: CalendarView) => {
  setView(view);
  router.push({
    query: {
      view,
      date: date.value.toISOString().split("T")[0],
    },
  });
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
    @on-view-change="handleViewChange"
  />
  <div :class="styles.container">
    <SideBar
      ref="sideBar"
      :date="date"
      @on-change="(date) => handleChange('date', date)"
    />
    <div :class="styles.calendar">
      <WeekCalendar
        v-if="view === 'week' || view === 'day'"
        :view="view"
        :selected-date="date"
        @on-change="(date) => handleChange('week', date)"
      />
      <MonthCalendar
        v-else-if="view === 'month'"
        :selected-date="date"
        @on-change="(date) => handleChange('month', date)"
      />
      <YearCalendar
        v-else-if="view === 'year'"
        :selected-date="date"
        @on-change="(date) => handleChange('year', date)"
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
