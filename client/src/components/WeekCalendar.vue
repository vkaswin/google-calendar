<script setup lang="ts">
import {
  toRefs,
  watch,
  ref,
  computed,
  onMounted,
  onUnmounted,
  useCssModule,
  inject,
  watchEffect,
} from "vue";
import { CalendarView, EventPopUpType } from "@/types/Calendar";
import { getDayName, timeSlots } from "@/utils";

type WeekCalendarProps = {
  selectedDate: Date;
  view: CalendarView;
};

type WeekCalendarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<WeekCalendarProps>();

let emit = defineEmits<WeekCalendarEmits>();

let eventPopup = inject<EventPopUpType>("eventPopup");

let styles = useCssModule("styles");

let { view, selectedDate } = toRefs(props);

let todayDate = new Date();

let calendarContainer: HTMLDivElement;

let indicator = ref<HTMLDivElement>();

let intervalId: ReturnType<typeof setInterval>;

let columns = computed(() => (view.value === "week" ? 7 : 1));

let timeSlotWidth = "65px";

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

watchEffect(() => {
  if (!eventPopup?.value) return;
  eventPopup.value.placement = view.value === "day" ? "bottom" : "left";
});

onMounted(() => {
  window.addEventListener("resize", handleIndicator);
  handleIndicator();
  intervalId = setInterval(updateIndicatorPosition, 60000);

  if (!eventPopup) return;

  eventPopup.value.container = calendarContainer;
});

const updateIndicatorPosition = () => {
  if (!indicator.value) return;
  let date = new Date();
  let height = parseInt(slotHeight.replace("px", ""));
  let top = date.getHours() * height + date.getMinutes();
  indicator.value.style.top = `${top}px`;
};

let updateIndicatorDimension = () => {
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
      : timeSlotWidth;

  indicator.value.style.width =
    view.value === "week"
      ? `${element.clientWidth}px`
      : `calc(100% - ${timeSlotWidth})`;
};

const handleIndicator = () => {
  updateIndicatorDimension();
  updateIndicatorPosition();
};

watch(
  [view, selectedDate],
  () => {
    handleIndicator();
  },
  { flush: "post" }
);

onUnmounted(() => {
  window.removeEventListener("resize", handleIndicator);
  clearInterval(intervalId);
});

let handleEvent = (date: Date, time: string) => {
  let element = calendarContainer.querySelector(
    `[data-date='${date.toLocaleDateString()}'][data-time='${time}']`
  ) as HTMLElement;

  if (!eventPopup?.value) return;

  eventPopup.value.reference = element;
  eventPopup.value.eventDetail.date = date.toISOString();
  eventPopup.value.eventDetail.time = time;

  if (!eventPopup.value.isOpen) eventPopup.value.openPopup();
};

let handleViewChange = (date: Date) => {
  if (view.value === "week") emit("onChange", date);
};
</script>

<template>
  <div :class="styles.container" :data-view="view">
    <div :class="styles.week_section">
      <div :class="styles.title">
        <span>GMT+05:30</span>
      </div>
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="[
          styles.week,
          todayDate.toLocaleDateString() === date.toLocaleDateString() &&
            styles.highlight,
        ]"
        @click="handleViewChange(date)"
      >
        <span>{{ getDayName(date.getDay()) }}</span>
        <span>{{ date.getDate() }}</span>
      </div>
      <div></div>
    </div>
    <div :class="styles.divider"></div>
    <div ref="calendarContainer" :class="styles.time_slot_section">
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
          :data-date="dates[index - 1].toLocaleDateString()"
          :data-time="time"
          @click="handleEvent(dates[index - 1], time)"
        >
          <div
            v-if="
              eventPopup?.isOpen &&
              eventPopup?.eventDetail.date === dates[index - 1].toISOString() &&
              eventPopup?.eventDetail.time == time
            "
            :class="styles.event_card"
          >
            <span>{{ eventPopup?.eventDetail.title || "(No Title)" }}</span>
            <span>{{ time }}</span>
          </div>
        </div>
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
  --week-wrapper-height: 90px;
  --scrollbar-width: 8px;
  --divider-height: 1px;
  --light-gray: rgb(218, 220, 224);
  .week_section {
    display: grid;
    grid-template-columns: v-bind(timeSlotWidth) repeat(7, 1fr) var(
        --scrollbar-width
      );
    height: var(--week-wrapper-height);
    div:first-child {
      display: flex;
      align-items: flex-end;
      font-size: 10px;
      color: #70757a;
      padding-bottom: 5px;
    }
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
          color: rgb(60, 64, 67);
          font-size: 14px;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          color: rgb(60, 64, 67);
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
      grid-template-columns: v-bind(timeSlotWidth) repeat(v-bind(columns), 1fr);
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
        display: flex;
        justify-content: flex-end;
        padding-right: 15px;
      }
      .date {
        position: relative;
        border-color: var(--light-gray);
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        cursor: pointer;
        &:nth-child(2) {
          border-width: 0px 0px 1px 1px;
        }
        .event_card {
          position: absolute;
          inset: 2px;
          background-color: rgb(3, 155, 229);
          border-color: rgb(3, 155, 229);
          box-shadow: 0px 6px 10px 0px rgb(0 0 0 / 14%),
            0px 1px 18px 0px rgb(0 0 0 / 12%), 0px 3px 5px -1px rgb(0 0 0 / 20%);
          border-radius: 4px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          span {
            color: white;
            &:first-child {
              font-size: 14px;
              font-family: "Poppins-Medium", sans-serif;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              word-break: break-all;
            }
            &:last-child {
              font-size: 12px;
            }
          }
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
