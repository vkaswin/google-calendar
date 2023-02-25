<script setup lang="ts">
import {
  toRefs,
  watch,
  ref,
  computed,
  onMounted,
  onUnmounted,
  useCssModule,
} from "vue";
import { CalendarView } from "@/types/calendar";
import { getDayName, timeSlots } from "@/utils";

type WeekCalendarProps = {
  selectedDate: Date;
  view: CalendarView;
};

let props = defineProps<WeekCalendarProps>();

let styles = useCssModule("styles");

let { view, selectedDate } = toRefs(props);

let todayDate = new Date();

let indicator = ref<HTMLDivElement>();

let intervalId: ReturnType<typeof setInterval>;

let columns = computed(() => (view.value === "week" ? 7 : 1));

let slotHeight = "60px";

let dates = computed(() => {
  let dates: Date[] = [];
  let date = structuredClone(selectedDate.value);

  dates.push(structuredClone(date));

  if (view.value === "week") {
    for (let i = date.getDay(); i < 6; i++) {
      date.setDate(date.getDate() + 1);
      dates.push(structuredClone(date));
    }

    date = structuredClone(selectedDate.value);

    for (let i = selectedDate.value.getDay(); i > 0; i--) {
      date.setDate(date.getDate() - 1);
      dates.unshift(structuredClone(date));
    }
  }

  return dates;
});

watch(view, () => handleIndicator());

onMounted(() => {
  window.addEventListener("resize", handleIndicator);

  handleIndicator();

  intervalId = setInterval(updateIndicatorPosition, 60000);
});

const updateIndicatorPosition = () => {
  if (!indicator.value) return;
  let date = new Date();
  let height = parseInt(slotHeight.replace("px", ""));
  let top = date.getHours() * height + date.getMinutes();
  indicator.value.style.top = `${top}px`;
};

const handleIndicator = () => {
  let container = document.querySelector<HTMLDivElement>(
    `.${styles.time_slot_container}`
  );

  if (!container) return;

  let element = document.querySelector<HTMLDivElement>(`.${styles.highlight}`);

  if (!element || !indicator.value) return;

  indicator.value.style.left =
    view.value === "week"
      ? `${
          element.getBoundingClientRect().left -
          container.getBoundingClientRect().left
        }px`
      : "40px";

  indicator.value.style.width =
    view.value === "week" ? `${element.clientWidth}px` : "calc(100% - 40px)";

  updateIndicatorPosition();
};

onUnmounted(() => {
  window.removeEventListener("resize", handleIndicator);
  clearInterval(intervalId);
});

let handleEvent = (date?: Date, time?: string) => {
  if (date && time) {
    console.log(
      "🚀 ~ file: WeekCalendar.vue:72 ~ handleTime ~ date, time",
      date,
      time
    );
  } else {
    console.log("close popup");
  }
};
</script>

<template>
  <div :class="styles.container" :data-view="view">
    <div :class="styles.week_section">
      <div></div>
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="[
          styles.week,
          todayDate.toLocaleDateString() === date.toLocaleDateString() &&
            styles.highlight,
        ]"
      >
        <span>{{ getDayName(date.getDay()) }}</span>
        <span>{{ date.getDate() }}</span>
      </div>
      <div></div>
    </div>
    <div :class="styles.divider"></div>
    <div :class="styles.time_slot_section">
      <div
        :class="styles.time_slot_container"
        v-for="({ label, time }, index) in timeSlots"
        :key="index"
      >
        <div :class="styles.time">
          <span v-if="index !== 0">{{ label }}</span>
        </div>
        <div
          :class="styles.date"
          v-for="index in columns"
          :key="index"
          @click="handleEvent(dates[index - 1], time)"
        ></div>
      </div>
      <div
        ref="indicator"
        v-show="
          dates.some(
            (date) =>
              date.toLocaleDateString() === todayDate.toLocaleDateString()
          )
        "
        :class="styles.indicator"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  height: 100%;
  padding-top: 15px;
  --week-wrapper-height: 95px;
  --scrollbar-width: 8px;
  --divider-height: 1px;
  --light-gray: rgb(218, 220, 224);
  .week_section {
    display: grid;
    grid-template-columns: 40px repeat(7, 1fr) var(--scrollbar-width);
    height: var(--week-wrapper-height);
    .week {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      &:nth-child(2)::before {
        left: 0px;
      }
      &::before {
        content: "";
        position: absolute;
        left: -1px;
        bottom: 0px;
        height: 25px;
        width: 1px;
        background-color: var(--light-gray);
      }
      &:is(.highlight) {
        span {
          &:first-child {
            color: rgb(26, 115, 232);
          }
          &:last-child {
            color: #fff;
            background-color: rgb(26, 115, 232);
          }
        }
      }
      &:not(.highlight) {
        span {
          &:last-child {
            &:hover {
              background-color: #f1f3f4;
            }
          }
        }
      }
      span {
        &:first-child {
          color: #70757a;
          font-size: 14px;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          color: #70757a;
          font-size: 24px;
          font-family: "Poppins-Medium", sans-serif;
          transition: background-color 0.25s ease-in-out;
          cursor: pointer;
        }
      }
    }
  }
  .divider {
    position: relative;
    left: 30px;
    background-color: var(--light-gray);
    height: var(--divider-height);
    width: calc(100% - 45px);
  }
  .time_slot_section {
    position: relative;
    height: calc(100% - var(--week-wrapper-height) - var(--divider-height));
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
      border-top-right-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: white;
    }
    &::-webkit-scrollbar-thumb {
      background: #bec1c6;
      border-radius: 10px;
    }
    .time_slot_container {
      display: grid;
      grid-template-columns: 40px repeat(v-bind(columns), 1fr);
      grid-auto-rows: v-bind(slotHeight);
      &:not(:first-child) {
        .time {
          &::before {
            content: "";
            position: absolute;
            top: 4px;
            right: 0px;
            width: 10px;
            height: 1px;
            background-color: var(--light-gray);
          }
        }
      }
      .time {
        position: relative;
        color: #70757a;
        font-size: 10px;
        font-family: "Poppins-Medium", sans-serif;
        margin-top: -5px;
      }
      .date {
        border-color: var(--light-gray);
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        cursor: pointer;
        &:nth-child(2) {
          border-width: 0px 0px 1px 1px;
        }
      }
    }
    .indicator {
      position: absolute;
      height: 2px;
      --bg-color: rgb(234, 67, 53);
      background-color: var(--bg-color);
      pointer-events: none;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0px;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background-color: var(--bg-color);
        border-radius: 50%;
      }
    }
  }
}

.container[data-view="week"] {
  .time_slot_section {
    .time_slot_container {
      .date {
        &:nth-child(2) {
          border-width: 0px 1px 1px 1px;
        }
        &:last-child {
          border-width: 0px 0px 1px 0px;
        }
      }
    }
  }
}
</style>