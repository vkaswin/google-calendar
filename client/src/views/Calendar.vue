<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import Loader from "@/components/Loader.vue";
import { storeToRefs } from "pinia";
import useAuth from "@/store/useAuth";
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

let router = useRouter();

let route = useRoute();

let { user } = storeToRefs(auth);

let sideBar = ref<InstanceType<typeof SideBar>>();

let selectedDate = ref(
  route.query.date ? new Date(route.query.date as string) : new Date()
);

let calendarView = ref<CalendarView>(
  (route.query.view as CalendarView) || "week"
);

watch(
  [() => route.query.view, () => route.query.date],
  ([view = "week", date = new Date().toISOString().split("T")[0]]) => {
    if (selectedDate.value.toISOString().split("T")[0] !== date) {
      selectedDate.value = new Date(date as string);
    }

    if (calendarView.value !== view) {
      calendarView.value = view as CalendarView;
    }
  }
);

let reset = () => {
  let date = new Date();
  sideBar.value?.datePicker?.setCurrentDate(date);
  router.push({
    query: {
      view: "week",
      date: date.toISOString().split("T")[0],
    },
  });
};

const handleNext = () => {
  let temp = structuredClone(selectedDate.value);

  switch (calendarView.value) {
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

  router.push({
    query: {
      view: calendarView.value,
      date: temp.toISOString().split("T")[0],
    },
  });
};

const handlePrevious = () => {
  let temp = structuredClone(selectedDate.value);

  switch (calendarView.value) {
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

  router.push({
    query: {
      view: calendarView.value,
      date: temp.toISOString().split("T")[0],
    },
  });
};

let handleChange = (date: Date) => {
  console.log("🚀 ~ file: Calendar.vue:92 ~ handleChange ~ date", date);

  calendarView.value = "day";

  sideBar.value?.datePicker?.setCurrentDate(date);

  router.push({
    query: {
      view: calendarView.value,
      date: date.toISOString().split("T")[0],
    },
  });
};

let handleViewChange = (view: CalendarView) => {
  router.push({
    query: {
      view,
      date: selectedDate.value.toISOString().split("T")[0],
    },
  });
};
</script>

<template>
  <Header
    :user="user"
    :date="selectedDate"
    :view="calendarView"
    @on-next="handleNext"
    @on-previous="handlePrevious"
    @on-reset="reset"
    @on-view-change="handleViewChange"
  />
  <div :class="styles.container">
    <SideBar
      ref="sideBar"
      :selected-date="selectedDate"
      @on-change="(date) => handleChange(date)"
    />
    <div :class="styles.calendar">
      <WeekCalendar
        v-if="calendarView === 'week' || calendarView === 'day'"
        :view="calendarView"
        :selected-date="selectedDate"
        @on-change="(date) => handleChange(date)"
      />
      <MonthCalendar
        v-else-if="calendarView === 'month'"
        :selected-date="selectedDate"
        @on-change="(date) => handleChange(date)"
      />
      <YearCalendar
        v-else-if="calendarView === 'year'"
        :selected-date="selectedDate"
        @on-change="(date) => handleChange(date)"
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
