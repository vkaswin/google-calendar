<script setup lang="ts">
import { ref, defineAsyncComponent, watch, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import useAuth from "@/store/useAuth";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import Loader from "@/components/Loader.vue";
import EventPopup from "@/components/EventPopup.vue";
import { CalendarView, EventPopUpType } from "@/types/Event";

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

let { logout } = auth;

let { user } = storeToRefs(auth);

let sideBar = ref<InstanceType<typeof SideBar>>();

let selectedDate = ref(
  route.query.date ? new Date(route.query.date as string) : new Date()
);

let calendarView = ref<CalendarView>(
  (route.query.view as CalendarView) || "week"
);

let eventPopup = ref({} as EventPopUpType);

provide("eventPopup", eventPopup);

let reset = () => {
  let date = new Date();
  sideBar.value?.datePicker?.setCurrentDate(date);
  router.push({
    query: {
      view: "week",
      date: dayjs().format("YYYY-MM-DD"),
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
      date: dayjs(temp).format("YYYY-MM-DD"),
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
      date: dayjs(temp).format("YYYY-MM-DD"),
    },
  });
};

let handleChange = (date: Date, view?: CalendarView) => {
  sideBar.value?.datePicker?.setCurrentDate(date);

  router.push({
    query: {
      ...route.query,
      date: dayjs(date).format("YYYY-MM-DD"),
      ...(view && { view }),
    },
  });
};

let handleViewChange = (view: CalendarView) => {
  router.push({
    query: {
      ...route.query,
      view,
    },
  });
};

watch(
  () => route.query,
  ({ view = "week", date = dayjs().format("YYYY-MM-DD") }) => {
    if (dayjs(selectedDate.value).format("YYYY-MM-DD") !== date) {
      selectedDate.value = new Date(date as string);
    }

    if (calendarView.value !== view) {
      calendarView.value = view as CalendarView;
    }

    if (eventPopup.value) {
      if (eventPopup.value.isOpen) eventPopup.value.reset();
      eventPopup.value.placement = view === "day" ? "bottom" : "left";
    }
  }
);

watch(
  () => eventPopup?.value?.eventDetail?.date,
  (date) => {
    if (date && eventPopup.value && eventPopup.value.isOpen)
      selectedDate.value = new Date(date);
  }
);

watch(
  selectedDate,
  (selectedDate) => {
    if (!eventPopup.value || !eventPopup.value.isOpen) return;

    let date = dayjs(selectedDate).format("YYYY-MM-DD");

    let element = eventPopup.value.container?.querySelector<HTMLElement>(
      `[data-date='${date}']${
        calendarView.value === "week" || calendarView.value === "day"
          ? `[data-time='${eventPopup.value.eventDetail.time}']`
          : ""
      }`
    );

    if (!element) return;

    eventPopup.value.reference = element;
  },
  { flush: "post" }
);
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
    @on-logout="logout"
  />
  <div :class="styles.container">
    <SideBar
      ref="sideBar"
      :view="calendarView"
      :selected-date="selectedDate"
      @on-change="handleChange"
    />
    <div :class="styles.calendar">
      <WeekCalendar
        v-if="calendarView === 'week' || calendarView === 'day'"
        :view="calendarView"
        :selected-date="selectedDate"
        @on-change="handleChange"
      />
      <MonthCalendar
        v-else-if="calendarView === 'month'"
        :selected-date="selectedDate"
        @on-change="handleChange"
      />
      <YearCalendar
        v-else-if="calendarView === 'year'"
        :selected-date="selectedDate"
        @on-change="handleChange"
      />
    </div>
  </div>
  <EventPopup ref="eventPopup" :view="calendarView" />
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
